const db = require("../database/connection")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports = async (req, res) => {
  const { email, username, password, confirmPassword } = req.body

  if (!email || !username || !password || !confirmPassword) {
    return res.status(200).send({
      success: false,
      message: "Missing data",
    })
  }

  if (password !== confirmPassword) {
    return res.status(200).send({
      success: false,
      message: "Passwords don't match",
    })
  }

  try {
    const results = await db.query("SELECT * FROM users WHERE email = $1 OR username = $2", [
      email,
      username,
    ])

    if (results.rows.length > 0) {
      return res.status(200).send({
        success: false,
        message: "Email or username already exists",
      })
    }

    const hash = await bcrypt.hash(password, 10)
    // hash: 2a.asd,2e/.asdwasdnaskdnasd.asldnalsdnalksnd

    const result = await db.query(
      `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)
            RETURNING id`,
      [username, email, hash]
    )

    // result.rows[0].id -> the id for the new user
    const token = jwt.sign(
      { id: result.rows[0].id },
      process.env.JWT_SECRET
    )

    res.status(200).send({
      success: true,
      token,
    })
  } catch (err) {

    res.status(200).send({
      success: false,
      message: "Something went wrong",
    })
  }
}
