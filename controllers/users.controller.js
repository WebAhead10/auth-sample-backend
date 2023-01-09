const db = require("../database/connection")

module.exports = async (req, res) => {
  try {
    const results = await db.query("SELECT email, username FROM users")
      .then((results) => {
        //
        res.status(200).send({
          success: true,
          users: results.rows,
        })
      })
  } catch (err) {

    res.status(500).send({ success: false })
  }
}
