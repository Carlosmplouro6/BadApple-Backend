const pool = require("./connection");

module.exports.getAll = async () => {
  try {
    let sql = String.raw`
    select Gen_id as id, Gen_nome as nome
    from genero 
    `;
    let generos = await pool.query(sql);
    return { status: 200, dados: generos };
  } catch (err) {
    console.log(err);
    return { status: 500, dados: err };
  }
};

module.exports.getOne = async (id) => {
  try {
    let sql = String.raw`
    select Fil_id as id, Fil_nome as nome, Fil_Desc as descricao, Fil_Trailer as trailer, Fil_Dur as duracao, Fil_Poster as poster, Gen_nome as genero
    FROM filme, genero, genero_filme
    WHERE GF_F_id=Fil_id AND GF_G_id=Gen_id AND Gen_id = ?
    `;
    let generos = await pool.query(sql, [id]);

    if (generos == null || generos.length == 0) {
      console.log("falhou");
      return { status: 404, dados: [] };
    }

    let PontuacaoSql = String.raw`
    SELECT SUM(opi_valor)/COUNT(opi_valor) "media"
    FROM filme, utilizador, opiniao
    WHERE  opi_filme=fil_id AND opi_user= usr_id AND Fil_id= ?
    GROUP BY Fil_nome
    `;
    let filmesP = [];
    for (const filme of generos) {
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
