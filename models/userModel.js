const pool = require("./connection");

module.exports.getOne = async (username) => {
  try {
    console.log("cheguei ao getOne");
    let sql = String.raw`
    select *
    FROM utilizador
    Where Usr_utilizador = ?
    `;
    let user = await pool.query(sql, username);
    return { status: 200, dados: user[0] };
  } catch (err) {
    console.log(err);
    return { status: 500, dados: err };
  }
};

module.exports.getById = async (id) => {
  try {
    let sql = String.raw`
      select *
      FROM utilizador
      Where Usr_id = ?
      `;
    let user = await pool.query(sql, id);
    return { status: 200, dados: user };
  } catch (err) {
    console.log(err);
    return { status: 500, dados: err };
  }
};

module.exports.postUser = async (user) => {
  try {
    console.log("cheguei ao postUser");
    let sql = String.raw`
    Insert into Utilizador (Usr_utilizador, Usr_email , Usr_password, Usr_admin)
	values ( ?,?,?,0);
        `;
    let utilizador = await pool.query(sql, [
      user.Username,
      user.Email,
      user.Password,
    ]);
    console.log(utilizador);
    return { status: 200, dados: utilizador };
  } catch (err) {
    console.log(err);
    return { status: 500, dados: err };
  }
};
