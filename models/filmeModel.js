const pool = require("./connection");

module.exports.getAll = async () => {
  try {
    let sql = String.raw`
    select Fil_id as id, Fil_nome as nome, Fil_Desc as descricao, Fil_Trailer as trailer, Fil_Dur as duracao, Fil_Poster as poster,  SUM(opi_valor)/ COUNT(opi_valor) as media
    FROM filme, pessoa, utilizador, opiniao
    WHERE usr_pessoa=pes_id AND opi_filme=fil_id AND opi_user=usr_id 
    GROUP BY Fil_id
    `;
    let filmes = await pool.query(sql);
    return { status: 200, dados: filmes };
  } catch (err) {
    console.log(err);
    return { status: 500, dados: err };
  }
};

module.exports.getFilme = async (id) => {
  try {
    let sql = String.raw`
    select Fil_id as id, Fil_nome as nome, Fil_Desc as descricao, Fil_Trailer as trailer, Fil_Dur as duracao, Fil_Poster as poster,  SUM(opi_valor)/ COUNT(opi_valor) as media
    FROM filme, pessoa, utilizador, opiniao
    WHERE usr_pessoa=pes_id AND opi_filme=fil_id AND opi_user=usr_id and Fil_id= ?
    GROUP BY Fil_id
      `;
    let filmes = await pool.query(sql, [id]);

    if (filmes == null || filmes.length == 0) {
      console.log("falhou");
      return { status: 404, dados: [] };
    }
    return { status: 200, dados: filmes[0] };
  } catch (err) {
    console.log(err);
    return { status: 500, dados: err };
  }
};
