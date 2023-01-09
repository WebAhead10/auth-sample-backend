const db = require("../database/connection")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports = async (req, res) => {
  const { username, password } = req.body

  try {
    const results = await db.query("SELECT * FROM users WHERE username = $1", [username])

    //
    if (results.rows.length === 0) {
      return res.status(403).send({
        success: false,
        message: "username does not exist",
      })
    }
    //
    const user = results.rows[0]

    const isCorrect = await bcrypt.compare(password, user.password)

    if (!isCorrect) {
      return res.status(403).send({
        success: false,
        message: "Incorrect password",
      })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)

    res.status(200).send({
      success: true,
      token,
    })

  } catch (err) {
    console.log(err)
    res.status(500).send({ success: false })
  }
}
