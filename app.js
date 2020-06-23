const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

const filmeRouter = require("./routes/filmesRouter");
const generoRouter = require("./routes/generoRouter");
const userRouter = require("./routes/userRouter");
const opiniaoRouter = require("./routes/opiniaoRouter");
const { ensureAuthenticated } = require("./config/auth");

var app = express();

require("./config/passport")(passport);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/api/filmes", filmeRouter);
app.use("/api/genero", generoRouter);
app.use("/api/user", userRouter);
app.use("/api/opiniao", opiniaoRouter);

module.exports = app;
