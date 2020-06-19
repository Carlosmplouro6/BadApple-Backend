const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = require("../models/userModel");
const { forwardAuthenticated } = require("../config/auth");

router.post("/register", (req, res) => {
  let utilizador = {
    Username: req.body.fUsername,
    Email: req.body.fEmail,
    Password: req.body.fPassword,
  };

  let errors = [];

  User.findOne(utilizador.Username).then(async (user) => {
    if (user) {
      errors.push({ msg: "Esse utilizador ja existe" });
      res.render("/index.html", {
        errors,
      });
    } else {
      utilizador.Password = await bcrypt.hash(utilizador.Password, 10);
      user.postUser(utilizador);
    }
  });
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/filmes.html",
    failureRedirect: "/index.html",
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logout bem efectuado");
  res.redirect("/index.html");
});

module.exports = router;
