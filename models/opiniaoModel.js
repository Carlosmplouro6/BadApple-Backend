const pool = require("./connection");

module.exports.getOne = async (idFilme, idUser) => {
  try {
    let sql = String.raw`
    SELECT Opi_valor "valor"
    from opiniao
    where  Opi_Filme=? AND Opi_user =?
    `;
    let pontuacao = await pool.query(sql, [idFilme, idUser]);
    console.log(pontuacao);
    if (pontuacao == null || pontuacao.length == 0) {
      return { status: 203, dados: { valor: "0" } };
    }
    return { status: 200, dados: pontuacao[0] };
  } catch (err) {
    console.log(err);
    return { status: 500, dados: err };
  }
};

module.exports.postOpi = async (opiniao) => {
  try {
    let CheckSql = String.raw`
    SELECT Opi_valor "valor"
    from opiniao
    where  Opi_Filme=? AND Opi_user =?
    `;
    let Check = await pool.query(CheckSql, [opiniao.idFilme, opiniao.idUser]);
    let resultado;
    if (Check == null || Check.length == 0) {
      let Sql = String.raw`
      Insert into opiniao(Opi_valor, Opi_user, Opi_Filme) 
      Values (?,?,?);
        `;
      resultado = await pool.query(Sql, [
        opiniao.valor,
        opiniao.idUser,
        opiniao.idFilme,
      ]);
    } else {
      let Sql = String.raw`
      Update opiniao
      SET
      Opi_valor = ?
      where Opi_user = ? And Opi_filme = ?
      `;
      resultado = await pool.query(Sql, [
        opiniao.valor,
        opiniao.idUser,
        opiniao.idFilme,
      ]);
    }

    console.log(resultado);
    return { status: 200, dados: { resultado } };
  } catch (err) {
    console.log(err);
    return { status: 500, dados: err };
  }
};
