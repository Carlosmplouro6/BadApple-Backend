const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = require("../models/userModel");

router.post("/create", (req, res) => {
  console.log("cheguei ao /create");
  let utilizador = {
    Username: req.body.fUsername,
    Email: req.body.fEmail,
    Password: req.body.fPassword,
  };
  console.log(utilizador);
  User.getOne(utilizador.Username).then(async (user) => {
    if (user.dados) {
      console.log(user.dados);
      let errors = { msg: "Esse utilizador ja existe" };
      res.render("index.html", {
        errors,
      });
    } else {
      utilizador.Password = await bcrypt.hash(utilizador.Password, 10);
      User.postUser(utilizador);
    }
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/index.html",
    failureFlash: true,
  }),
  function (req, res) {
    res.redirect("/filmes.html");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logout bem efectuado");
  res.redirect("/index.html");
});

module.exports = router;
