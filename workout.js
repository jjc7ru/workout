const express = require('express');
const morgan = require('morgan');
const session = require("express-session");
const store = require("connect-loki");
const flash = require("express-flash");
const dbQuery = require("./lib/db-query");
const PgPersistence = require("./lib/pg-persistence");
const catchError = require("./lib/catch-error");

const app = express();
const port = 3000;
const host = 'localhost';
const LokiStore = store(session);

app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in millseconds
    path: "/",
    secure: false,
  },
  name: "workout-session-id",
  resave: false,
  saveUninitialized: true,
  secret: "to be replaced later with config file",
  store: new LokiStore({}),
}));

//temporary
app.use((req, res, next) => {
  req.session.username = 'admin';
  next();
});

app.use(flash());

app.use((req, res, next) => {
  res.locals.store = new PgPersistence(req.session);
  next();
});

app.get("/", (req, res) => {
  res.redirect("/groups");
});

app.get("/groups", async (req, res) => {
  let store = res.locals.store;
  let exerciseGroups = await store.loadAllExerciseGroups();
  res.render("groups", {
    exerciseGroups,
  });
});

app.post("/groups/create", 
  catchError(async (req, res) => {
    let store = res.locals.store;
    let group = req.body.group;
    let exerciseGroup = await store.createExerciseGroup(group);
    if (!exerciseGroup) throw new Error("Not found.");
    res.redirect("/groups");
  })
);

app.get("/groups/:groupId", 
  catchError(async (req, res) => {
    let store = res.locals.store;
    let groupId = req.params.groupId;
    let exerciseGroup = await store.loadExerciseGroup(groupId);
    
    if (!exerciseGroup) throw new Error("Not found.");
    res.render("exercises", {
      exerciseGroup: exerciseGroup[0],
    });
  })
);

// Error handler
app.use((err, req, res, _next) => {
  console.log(err); // Writes more extensive information to the console log
  res.status(404).send(err.message);
});

// Listener
app.listen(port, host, () => {
  console.log(`Todos is listening on port ${port} of ${host}!`);
});
