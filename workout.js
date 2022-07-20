const express = require('express');
const morgan = require('morgan');
const session = require("express-session");
const store = require("connect-loki");

const app = express();
const port = 3000;
const host = 'localhost';

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("layout");
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
