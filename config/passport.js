const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcrypt");

const User = require("../models/userModel");

module.exports = function () {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      console.log(username);
      await User.getOne(username).then(async (user) => {
        console.log(user);
        if (!user) {
          console.log("user nao existe");
          return done(null, false, {
            message: "O nome de utilizador não é valido.",
          });
        }

        await bcrypt.compare(
          password,
          user.dados.Usr_password,
          (err, correto) => {
            if (err) throw err;
            if (correto) {
              console.log("login feito");
              return done(null, user);
            } else {
              console.log("pass errada");
              return done(null, false, { message: "Password incorreta" });
            }
          }
        );
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.dados.Usr_id);
  });

  passport.deserializeUser(function (id, done) {
    User.getById(id).then(function (user) {
      done(null, user);
    });
  });
};
