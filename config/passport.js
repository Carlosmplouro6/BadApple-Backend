const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/userModel");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "fUsername" },
      (username, password, done) => {
        User.getOne(username).then((user) => {
          if (!user) {
            return done(null, false, {
              message: "O nome de utilizador não é valido.",
            });
          }

          bcrypt.compare(password, user.Usr_password, (err, correto) => {
            if (err) throw err;
            if (correto) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorreta" });
            }
          });
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.getById(id, function (err, user) {
      done(err, user);
    });
  });
};
