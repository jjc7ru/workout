const express = require('express');
const morgan = require('morgan');
const session = require("express-session");
const store = require("connect-loki");
const flash = require("express-flash");
const dbQuery = require("./lib/db-query");
const PgPersistence = require("./lib/pg-persistence");
const catchError = require("./lib/catch-error");
const { redirect } = require('express/lib/response');

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

app.get("/groups", 
  catchError(async (req, res) => {
    let store = res.locals.store;
    let exerciseGroups = await store.loadAllExerciseGroups();
    if (!exerciseGroups) throw Error("Not found.");
    res.render("groups", {
      exerciseGroups,
    });
  })
);

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
    let exerciseGroup = await store.loadGroupAndExercises(groupId);
    
    if (!exerciseGroup) throw new Error("Not found.");
    res.render("group", {
      exerciseGroup,
    });
  })
);

app.post("/groups/:groupId/create", 
  catchError(async (req, res) => {
    let store = res.locals.store;
    let groupId = req.params.groupId;
    let [ exercise_name, sets, reps ] = [ req.body.exercise, req.body.sets, req.body.reps ];
    let created = await store.createExercise(exercise_name, sets, reps, groupId);
    if (!created) throw new Error("Not found.");
    res.redirect(`/groups/${groupId}`);
  })
)

app.get("/groups/:groupId/edit", 
  catchError(async (req, res) => {
    let store = res.locals.store;
    let groupId = req.params.groupId;
    let group = await store.loadExerciseGroup(groupId);
    if (!group) throw new Error("Not found.");
    
    res.render("groups-edit.pug", {
      groupId,
      group,
    })
  })
)

app.post("/groups/:groupId/edit", 
  catchError(async (req, res) => {
    let store = res.locals.store;
    let groupId = req.params.groupId;
    let group_name = req.body.group_name;
    let result = await store.editGroup(group_name, groupId);
    if (!result) throw new Error("Not found.");
    res.redirect("/groups");
  })
) 

app.post("/groups/:groupId/destroy", 
  catchError(async (req, res) => {
    let store = res.locals.store;
    let groupId = req.params.groupId;
    let result = await store.deleteGroup(groupId);
    if (!result) throw new Error("Not found.");
    res.redirect("/groups");
  })
) 

app.get("/groups/:groupId/exercises/:exerciseId",
  catchError(async (req, res) => {
    let store = res.locals.store;
    let today = new Date().toDateString();
    let exerciseId = req.params.exerciseId;
    let date;
    
    let exercise = await store.loadExerciseLatestExercisedDate(exerciseId, today);
    if (!exercise) throw new Error("Not found.");

    let exerciseToday = await store.loadUserExerciseToday(exerciseId, today);

    if (exercise.user_exercises[0]) {
      date = exercise.user_exercises[0].exercise_date.toDateString();
    } else {
      date = "This exercise has not been performed before today.";
    }
   
    res.render("exercises", {
      today,
      exerciseToday,
      date,
      exerciseName: exercise.exercise_name,
      exercise,
    })
  })
);

app.post("/groups/:groupId/exercises/:exerciseId/create", 
  catchError(async (req, res) => {
    let store = res.locals.store;
    let [ groupId, exerciseId ] = [ req.params.groupId, req.params.exerciseId ];
    let [ set, reps, weight ] = [ req.body.set, req.body.reps, req.body.weight ];
    let today = new Date();
    let result = await store.createUserExercise(set, reps, weight, today, exerciseId);
    if (!result) throw new Error("Not found.");
    res.redirect(`/groups/${groupId}/exercises/${exerciseId}`);
  })
);

// Error handler
app.use((err, req, res, _next) => {
  console.log(err); // Writes more extensive information to the console log
  res.status(404).send(err.message);
});

// Listener
app.listen(port, host, () => {
  console.log(`Listening on port ${port} of ${host}!`);
});
