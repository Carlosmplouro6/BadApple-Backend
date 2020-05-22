const express = require("express");
const router = express.Router();
const filmeModel = require("../models/filmeModel");

router.get("/", async (req, res, next) => {
  let resultado = await filmeModel.getAll();
  res.status(resultado.status).json(resultado.dados);
});

router.get("/:id", async (req, res, next) => {
  let id = req.params.id;
  let resultado = await filmeModel.getFilme(id);

  if (resultado.status === 404) {
    res.status(404).send("Nao se encontra esse id");
  } else {
    res.status(resultado.status).json(resultado.dados);
  }
});

module.exports = router;
