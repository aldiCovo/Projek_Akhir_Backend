const router = require("express").Router();
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
//const { sendVerify } = require("../emails/sendGrid");
const conn = require("../config/connection");
//const multer = require("multer");

// REGISTRASI (POST DATA USER TO DB)
router.post("/register", async (req, res) => {
  var sql = `INSERT INTO users SET ?`;
  var sql2 = `SELECT * FROM USERS`;
  var data = req.body;

  var arrBody = Object.keys(req.body);
  // mengubah nilai string kosong menjadi null
  arrBody.forEach(key => {
    // menghapus field yang tidak memiliki data
    if (!req.body[key]) {
      req.body[key] = null; // set input kosong dengan null
    }
  });

  if (req.body.email === null || !isEmail(req.body.email))
    return res.send("Email is not valid !");

  if (req.body.password === null) return res.send("please enter password");
  req.body.password = await bcrypt.hash(req.body.password, 8);

  conn.query(sql, data, (err, result) => {
    if (err) return res.send(err.sqlMessage);

    conn.query(sql2, (err, result) => {
      if (err) return res.send(err.sqlMessage);
      res.send(result);
    });
  });
});

// LOGIN
router.post("/login", (req, res) => {
  // LOGIN USER harus pilih headers kemudian ceklis Content-Type dengan value = application/json
  const { email, password } = req.body;

  const sql = `SELECT * FROM users WHERE email = '${email}'`;

  console.log(email, password);

  conn.query(sql, async (err, result) => {
    if (err) return res.send(err.message); // Error pada query SQL

    const user = result[0]; // Result berupa array of object

    if (!user) return res.send("User not found"); // User tidak ditemukan

    if (!user.verified) return res.send("Please, verify your email"); // Belum verifikasi email

    const hash = await bcrypt.compare(password, user.password); // true / false

    if (!hash) return res.send("Wrong password"); // Password salah

    res.send(user); // Kirim object user
  });
});

// GET DATA USER
router.get("/getusers", (req, res) => {
  const email = req.body.email;
  const sql2 = `SELECT * FROM users WHERE email = '${email}'`;

  conn.query(sql2, (err, result) => {
    if (err) return res.send(err.sqlMessage);
    return res.send(result);
  });
});

module.exports = router;
