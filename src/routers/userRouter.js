const router = require("express").Router();
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
//const { sendVerify } = require("../emails/sendGrid");
const conn = require("../config/connection");
const multer = require("multer");
const path = require('path') // Menentukan folder uploads
const fs = require('fs') // menghapus file gambar


// REGISTRASI (POST DATA USER TO DB)
router.post("/register", async (req, res) => {
  var sql = `INSERT INTO users SET ?`;
  var sql2 = `SELECT * FROM USERS`;
  var data = req.body;

  // var arrBody = Object.keys(req.body);
  // // mengubah nilai string kosong menjadi null
  // arrBody.forEach(key => {
  //   // menghapus field yang tidak memiliki data
  //   if (!req.body[key]) {
  //     req.body[key] = null; // set input kosong dengan null
  //   }
  // });

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
    if (err) return res.send(err); // Error pada query SQL

    const user = result[0]; // Result berupa array of object

    if (!user) return res.send("User not found"); // User tidak ditemukan

    if (!user.verified) return res.send("Please, verify your email"); // Belum verifikasi email

    const hash = await bcrypt.compare(password, user.password); // true / false

    if (!hash) return res.send("Wrong password"); // Password salah

    res.send(user); // Kirim object user
  });
});

// GET DATA USER by Email
router.get("/getusers", (req, res) => {
  const email = req.body.email;
  const sql2 = `SELECT * FROM users WHERE email = '${email}'`;

  conn.query(sql2, (err, result) => {
    if (err) return res.send(err.sqlMessage);
    return res.send(result);
  });
});


// GET DATA USER by UserId
router.get("/getusers/:userId",  (req, res) => {
  const {userId} = req.params
  const sql2 = `SELECT * FROM users WHERE id = '${userId}'`;

  conn.query(sql2, (err, result) => {
    if (err) return res.send(err.sqlMessage);
    return res.send(result);
  });
});


// Upload Avatar
const uploadDir = path.join(__dirname + '/../uploads/avatar/' )
const storagE = multer.diskStorage({
    // Destination
    destination : function(req, file, cb) {
        cb(null, uploadDir)
    },
    // Filename
    filename : function(req, file, cb) {
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    }
})
const upstore = multer ({
    storage: storagE,
    limits: {
        fileSize: 10000000 // Byte
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
            return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
        }

        cb(undefined, true)
    }
})


// Edit User Data by UserId
router.patch(`/updateuser/:userId/avatar`,  upstore.single('avatar'), async (req, res) => {
  // agar jika ada kolom yang tidak d udate akan di delete
 Object.keys(req.body).forEach(key=>{
   if(!req.body[key]){
     delete req.body[key]
   }
 })

//  var arrBody = Object.keys(req.body);
//   // mengubah nilai string kosong menjadi null
//   arrBody.forEach(key => {
//     // menghapus field yang tidak memiliki data
//     if (!req.body[key]) {
//       req.body[key] = null; // set input kosong dengan null
//     }
//   });

  try {
    //console.log(req.params.userId);
    // Kondisi jika user update data user tanpa update avatar
    
       if(req.file === undefined){
        const userId = req.params.userId
        const sql = `UPDATE users SET ? WHERE id=${userId}`
        const sql3 = `SELECT * FROM users WHERE id=${userId}`
        const data = req.body
          conn.query(sql, data, (err, result)=>{
            if (err) return res.send(err)

            conn.query(sql3, (err,result)=>{
              if (err) return res.send (err)

              return res.send(result)
            })
         })
        }else {
          // Kondisi jika user update data user beserta avatar
            const userId = req.params.userId
            const sql = `UPDATE users SET ? WHERE id=${userId}`
            const sql3 = `SELECT * FROM users WHERE id = ${userId}`
            const sql2 = `UPDATE users SET avatar = '${req.file.filename}' WHERE id = '${userId}'`
            const data = req.body
            conn.query(sql, data, (err, result)=>{
            if (err) return res.send(err)
            conn.query(sql2, (err,result)=>{
              if (err) return res.send (err)
              // res.send({filename: req.file.filename})
              conn.query(sql3, data, (err, result) => {
                if (err) return res.send(err)
                return res.send(result)
             
            })
            
          })
         

       })
       
   // console.log(req.file);
       }
       
    
} catch (e) {
    res.send(e)
}
})
 
  





// Mendapatkan Image Avatar dari folder uploads
router.get ("/showAvatar/:product_image", (req, res)=>{
  res.sendFile(`${uploadDir}/${req.params.product_image}`)
})












  // Update user data incule password & avatar doni
  router.patch(`/updateuser/:userId/avatar/new`,  upstore.single('avatar'),async (req, res) => {
    const {userId} = req.params
    var arrBody = Object.keys(req.body)

    // menghapus field yang tidak ada isinya
    arrBody.forEach(key=>{
        if(!req.body[key]){
            delete req.body[key]
        }
    })    

    const sql = `UPDATE users SET ? WHERE id ='${userId}'`;
    const data = req.body
    
    if(req.file===undefined){

       // hash password untuk kondisi req.file kosong
      if(req.body.user_password){
        req.body.user_password= await bcrypt.hash(req.body.password, 8);
      }
        conn.query(sql,data,(err,result)=>{
            if(err) return res.send(err)

            return res.send(result)
        })
    }
    else{
          const sql2 = `SELECT avatar FROM users WHERE id='${userId}'`;

          // hash password untuk kondisi req.file tidak kosong
          if (req.body.password) {
            var hash_password = await bcrypt.hash(req.body.password,8);
          }

          const sql3 = `UPDATE users SET 
                             username='${req.body.username}',
                             first_name='${req.body.first_name}',
                             last_name='${req.body.last_name}',
                             email='${req.body.email}',
                             password='${hash_password}',
                             avatar='${req.file.filename}' 
                            WHERE id='${userId}'`;

          conn.query(sql2, (err, result) => {
            if (err) return res.send(err.sqlMessage);
            if (result[0].avatar === "defaultpic.jpg") {
            // if (result[0].avatar === "defaultpic.png") {
              conn.query(sql3, (err, result) => {
                if (err) return res.send(err);

                res.send(result);
              });
            } else {
              console.log("masuk kondisi !== default pic");
              
              conn.query(sql2, (err, result) => {
                if (err) return res.send(err.sqlMessage);
                const avatar = result[0].avatar;
                const imgPath = uploadDir + avatar;
                // const imgPath = uploadAva + avatar;
                console.log(avatar);
                console.log(req.file.filename);

                fs.unlink(imgPath, err => {
                  if (err) return res.send(err);

                  conn.query(sql3, (err, result) => {
                    if (err) return res.send(err);

                    return res.send(result);
                  });
                });
              });
            }
          });
        }
  })



  //UPDATE PROFILE REY
  router.patch('/users/:userid', async (req, res) => {
    var arrBody = Object.keys(req.body)

    arrBody.forEach(key => {
        if(!req.body[key]){
            delete req.body[key]
        }
    })
    if(req.body.password){
        req.body.password = await bcrypt.hash(req.body.password, 8)
    } 

    const sql = `UPDATE users SET ? WHERE id = ?`
    const sql2 = `SELECT * FROM users WHERE id = ${req.params.userid}`
    const data = [req.body, req.params.userid]

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.mess)

        conn.query(sql2, data, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send(result)
        })
    })
})


  // DELETE USER
// DELETE IMAGE ON FOLDER also COLOUM IN PRODUCT TABLE

router.delete("/delete/profile/:userId", (req, res) => { 
  const userId = req.params.userId
  const sql = `SELECT avatar FROM users WHERE id = ${userId}` // Get avatar column from user
  const sql2 = `DELETE FROM users WHERE id = ${userId}` // Set null on avatar column
  //const sql3 = `SELECT * FROM products WHERE id = '${req.body.id}'` // Get updated user
  const sql3 = `SELECT * FROM users ` // Get updated tabel products
  conn.query(sql, (err, result) => {
      if(err) return res.send(err)

      const avatar = result[0].avatar // Get avatar column

      const imgPath = uploadDir + avatar // File location
      console.log(imgPath);
      
      //fs.unlink(`${uploadDir}/${result[0].product_image}`, err => { // Delete file avatar
      fs.unlink(imgPath, err => { // Delete file avatar
          if (err) return res.send(err)

          conn.query(sql2, (err, result) => {
              if (err) return res.send(err)

              conn.query(sql3, (err, result) => {
                  if (err) return res.send(err)
  
                  res.send(result)
              })
          })
          
      })
  })
}) 



module.exports = router;