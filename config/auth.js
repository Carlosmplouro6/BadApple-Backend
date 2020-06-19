module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash(
      "error_msg",
      "Para aceder a este recurso necessita de fazer login"
    );
    res.redirect("index.html");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("filmes.html");
  },
};
