const router = require('express').Router();
const bcrypt = require('bcryptjs')
const isEmail = require('validator/lib/isEmail')
// const { sendVerify } = require("../emails/sendGrid");
const conn = require('../config/connection')
const multer = require('multer') //untuk upload gambar
const path = require('path') // menentukan folder tempat file yang akan di uploads
const fs = require('fs') // untuk menghapus file gambar

// definisikan folder tempat kita akan menyimpan file yg akan diupload
const uploadDir = path.join(__dirname + '/../uploads')

// Upload file ke DIRECTORY 
const Storage = multer.diskStorage({
  // Destination
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.fieldname + path.extname(file.originalname)) // files.filename -> file.filename
  }
})

const upstore = multer({
  storage: Storage,
  limits: {
    fileSize: 20000000 // Byte
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { // will be error if the extension name is not one of these
      return cb(new Error('Please upload image file (jpg, jpeg, or png)'))
    }

    cb(undefined, true)
  }
})

// POST AVATAR to DB
router.post('/upstore', upstore.single('avatar'), (req, res) => {
  const sql = `SELECT * FROM users WHERE username = ?`
  const sql2 = `UPDATE users SET avatar = '${req.file.filename}' WHERE username='${req.body.uname}'` //req.files.filename => req.file.filename
  const data = req.body.uname //usname => uname

  conn.query(sql, data, (err, result) => {
    if (err) return res.send(err)

    conn.query(sql2, data, (err, result) => {
      if (err) return res.send(err)

      res.send({ filename: req.file.filename })
    })
  })

})

// DELETE AVATAR FROM TABLE MYSQL 
router.delete('/deleteAvatar', (req,res) => {
  var data = req.body.username
  const sql = `SELECT * FROM users WHERE username = '${data}'`
  const sql2 = `UPDATE users SET avatar = NULL WHERE username = '${data}'`

  
  conn.query(sql, data, (err, result) => {
      if (err) return res.send(err)

      fs.unlink(`${uploadDir}/${result[0].avatar}`, (err) => {
          if(err) throw err
      })
      conn.query(sql2, data ,(err , result) => {
          if (err) return res.send(err)

          res.send(result)
      })
  })

})

router.post('/users/login', (req, res) => {
  const {username, password} = req.body

  const sql = `SELECT * FROM users WHERE username ='$(username)'`
})
// CREATE LINK
router.get('/avatar', (req,res) => {
  const sql = `SELECT * FROM users WHERE username = ?`
  const data = req.body.username

  conn.query(sql, data, (err,result) => {
    if(err) return res.send(err)

    res.send({users:result[0], photo:`http://localhost:2010/avatar/${result[0].avatar}`})
  })
})

// ROUTER JALAN ketika link dijalankan
router.get('/avatar/:avatar', (req, res) => {
  res.sendFile(`${uploadDir}/${req.params.avatar}`)
})

//CREATE USER
router.post('/users', async (req, res) => {
  const { nama, age } = req.body
  var sql = `INSERT INTO users SET ?;`
  var sql2 = `SELECT * FROM users;`
  var data = req.body

  //  Validasi Email
  if (!isEmail(req.body.email)) return res.send("Email is not valid")
  // jika validasi berhasil
  req.body.password = await bcrypt.hash(req.body.password, 8)

  conn.query(sql, data, (err, result) => {
    if (err) return res.send(err); // object error akan dikirim ke postman dan API tetap jalan, kalau (throw err) API akan berhenti

    // sendVerify(req.body.username, req.body.name, req.body.email);


    conn.query(sql2, (err, result) => {
      if (err) return res.send(err);

      res.send(result);
    });
  });
})

// VERIFY EMAIL
router.get('/verify', (req, res) => {
  const username = req.query.username
  const sql = `UPDATE users SET verified = true WHERE username = '${username}'`
  const sql2 = `SELECT * FROM users WHERE username = '${username}'`

  conn.query(sql, (err, result) => {
    if (err) return res.send(err, sqlMessage)

    conn.query(sql2, (err, result) => {
      if (err) return res.send(err, sqlMessage)

      res.send(`<h1>Verifikasi Berhasil<h1>`)
    })
  })
})

module.exports = router