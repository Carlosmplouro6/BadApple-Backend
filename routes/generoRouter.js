const express = require("express");
const router = express.Router();
const generoModel = require("../models/generoModel");

router.get("/", async (req, res, next) => {
  //console.log(req.user.Usr_id + " Tentou aceder");
  let resultado = await generoModel.getAll();
  res.status(resultado.status).json(resultado.dados);
});

router.get("/:id", async (req, res, next) => {
  let id = req.params.id;
  let resultado = await generoModel.getOne(id);

  if (resultado.status === 404) {
    res.status(404).send("Nao se encontra esse id");
  } else {
    res.status(resultado.status).json(resultado.dados);
  }
});

module.exports = router;
