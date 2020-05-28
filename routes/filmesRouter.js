const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const parts = file.mimetype.split("/");
    cb(null, `${file.originalname}${Date.now()}.${parts[1]}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("poster"), async (req, res, next) => {
  let filme = {
    nome: req.body.nome,
    desc: req.body.desc,
    trailer: req.body.Trailer,
    pais: parseInt(req.body.Pais),
    duracao: parseInt(req.body.Duracao),
    categorias: req.body.Categorias,
    poster: `/images/${req.file.filename}`,
  };
  let resultado = await filmeModel.postFilme(filme);
  res.status(200).json("Filme Guardado");
});

module.exports = router;
