const pool = require("./connection");

module.exports.getAll = async () => {
  try {
    let Filmesql = String.raw`
    select Fil_id as id, Fil_nome as nome, Fil_Desc as descricao, Fil_Trailer as trailer, Fil_Dur as duracao, Fil_Poster as poster
    FROM filme
    `;
    let filmes = await pool.query(Filmesql);

    let PontuacaoSql = String.raw`
    SELECT SUM(opi_valor)/COUNT(opi_valor) "media"
    FROM filme, utilizador, opiniao
    WHERE  opi_filme=fil_id AND opi_user= usr_id AND Fil_id= ?
    GROUP BY Fil_nome
    `;
    let filmesP = [];
    for (const filme of filmes) {
      let filmeP = {
        id: filme.id,
        nome: filme.nome,
        descricao: filme.descricao,
        trailer: filme.trailer,
        duracao: filme.duracao,
        poster: filme.poster,
        media: 0,
      };
      let pontuacao = await pool.query(PontuacaoSql, [filme.id]);
      if (pontuacao == null || pontuacao.length == 0) {
        filmeP.media = 0;
      } else {
        filmeP.media = pontuacao[0].media;
      }
      filmesP.push(filmeP);
    }

    return { status: 200, dados: filmesP };
  } catch (err) {
    console.log(err);
    return { status: 500, dados: err };
  }
};

module.exports.getFilme = async (id) => {
  try {
    let sql = String.raw`
    select Fil_id as id, Fil_nome as nome, Fil_Desc as descricao, Fil_Trailer as trailer, Fil_Dur as duracao, Fil_Poster as poster
    FROM filme
    WHERE Fil_id = ? 
      `;
    let filmes = await pool.query(sql, [id]);

    if (filmes == null || filmes.length == 0) {
      return { status: 404, dados: [] };
    }
    let PontuacaoSql = String.raw`
    SELECT SUM(opi_valor)/COUNT(opi_valor) "media", COUNT(opi_valor)"votos"
    FROM filme, utilizador, opiniao
    WHERE  opi_filme=fil_id AND opi_user= usr_id AND Fil_id= ?
    GROUP BY Fil_nome
    `;
    let filmesP = [];
    for (const filme of filmes) {
      let filmeP = {
        id: filme.id,
        nome: filme.nome,
        descricao: filme.descricao,
        trailer: filme.trailer,
        duracao: filme.duracao,
        poster: filme.poster,
        media: 0,
        votos: 0,
      };
      let pontuacao = await pool.query(PontuacaoSql, [filme.id]);

      if (pontuacao == null || pontuacao.length == 0) {
        filmeP.media = 0;
        filmeP.votos = 0;
      } else {
        filmeP.media = pontuacao[0].media;
        filmeP.votos = pontuacao[0].votos;
      }
      filmesP.push(filmeP);
    }

    return { status: 200, dados: filmesP[0] };
  } catch (err) {
    console.log(err);
    return { status: 500, dados: err };
  }
};

module.exports.postFilme = async (filme) => {
  try {
    let FilmeSql = String.raw`
    insert into filme (Fil_nome,Fil_Desc,Fil_Trailer,Fil_Pais,Fil_Dur,Fil_Poster)
    values (?,?,?,?,?,?);
      `;
    let filmes = await pool.query(FilmeSql, [
      filme.nome,
      filme.desc,
      filme.trailer,
      filme.pais,
      filme.duracao,
      filme.poster,
    ]);

    let CategoriaSql = String.raw`
    Insert into Genero_Filme(GF_F_id,GF_G_id) Values (?, ?);
    `;

    filme.categorias.map(async (categoria) => {
      let cat = parseInt(categoria);
      let setCategoria = await pool.query(CategoriaSql, [filmes.insertId, cat]);
    });

    return { status: 200, dados: { filmes } };
  } catch (err) {
    console.log(err);
    return { status: 500, dados: err };
  }
};
