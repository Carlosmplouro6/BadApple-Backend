const express = require("express");
const router = express.Router();
const opiniaoModel = require("../models/opiniaoModel");

router.get("/:id", async (req, res, next) => {
  let idFilme = req.params.id;
  let idUser;
  try {
    idUser = req.user.Usr_id;
  } catch {
    res.status(401).json("Necessita de efetuar o login para votar");
    return;
  }

  let resultado = await opiniaoModel.getOne(idFilme, idUser);

  if (resultado.status === 404) {
    res.status(404).send("Nao se encontra esse id");
  } else {
    res.status(resultado.status).json(resultado.dados);
  }
});

router.post("/", async (req, res, next) => {
  let opiniao = {
    valor: req.body.valor,
    idFilme: req.body.idFilme,
    idUser: req.user.Usr_id,
  };
  let resultado = await opiniaoModel.postOpi(opiniao);
  res.status(200).json("opiniao Guardada");
});

module.exports = router;
