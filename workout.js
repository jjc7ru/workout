const express = require('express');
const morgan = require('morgan');
const session = require("express-session");
const store = require("connect-loki");
const flash = require("express-flash");

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

app.use(flash());

app.get("/", (req, res) => {
  res.render("lists");
});

// Error handler
app.use((err, req, res, _next) => {
  console.log(err); // Writes more extensive information to the console log
  res.status(404).send(err.message);
});

// Listener
app.listen(port, host, () => {
  console.log(`Todos is listening on port ${port} of ${host}!`);
});
