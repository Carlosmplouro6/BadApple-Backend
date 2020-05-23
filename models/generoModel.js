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
    select Fil_id as id, Fil_nome as nome, Fil_Desc as descricao, Fil_Trailer as trailer, Fil_Dur as duracao, Gen_nome as genero, SUM(opi_valor)/ COUNT(opi_valor) as media
    FROM filme, pessoa, utilizador, opiniao, genero, genero_filme
    WHERE usr_pessoa=pes_id AND opi_filme=fil_id AND opi_user=usr_id  AND GF_F_id=Fil_id AND GF_G_id=Gen_id AND Gen_id = ${id}
    GROUP BY Fil_nome
    `;
    let generos = await pool.query(sql);

    if (generos == null || generos.length == 0) {
      console.log("falhou");
      return { status: 404, dados: [] };
    }

    return { status: 200, dados: generos };
  } catch (err) {
    console.log(err);
    return { status: 500, dados: err };
  }
};
