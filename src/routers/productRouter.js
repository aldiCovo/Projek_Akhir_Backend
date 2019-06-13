const router = require("express").Router();
const conn = require("../config/connection");
const multer = require("multer");
const path = require('path') // Menentukan folder uploads
const fs = require('fs') // menghapus file gambar


// GET DATA PRODUCTS by ProdId
router.get("/getProduct/:productId",  (req, res) => {
  const {productId} = req.params
  const sql2 = `SELECT * FROM products WHERE id = '${productId}'`;

  conn.query(sql2, (err, result) => {
    if (err) return res.send(err.sqlMessage);
    return res.send(result);
  });
});


// GET ALL DATA PRODUCTS 
router.get("/getProduct",  (req, res) => {
 
  const sql2 = `SELECT * FROM products `;

  conn.query(sql2, (err, result) => {
    if (err) return res.send(err.sqlMessage);
    return res.send(result);
  });
});



// Upload Product Image
const uploadDir = path.join(__dirname + '/../uploads/product_image' )
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


// Post Product Data to DB
router.post("/postProd",  upstore.single('product_image'), async (req, res) => {
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
        //const prodId = req.params.prodId
        const sql = `INSERT INTO products SET ?`;
        //const sql = `UPDATE products SET ? WHERE id=${prodId}`
        const sql3 = `SELECT * FROM products` ;
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
            //const prodId = req.params.prodId
            const sql = `INSERT INTO products SET ?`;
            //const sql = `UPDATE products SET ? WHERE id=${prodId}`
            const sql3 = `SELECT * FROM products `
            const sql2 = `UPDATE products SET product_image = '${req.file.filename}' `
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


// Edit Product Data by ProductId
router.patch(`/updateProd/:prodId/product_image`,  upstore.single('product_image'), async (req, res) => { //upstore.single('product_image') update ke column product_image di tabel products
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
        const prodId = req.params.prodId
        const sql = `UPDATE products SET ? WHERE id=${prodId}`
        const sql3 = `SELECT * FROM products WHERE id=${prodId}`
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
            const prodId = req.params.prodId
            const sql = `UPDATE products SET ? WHERE id=${prodId}`
            const sql3 = `SELECT * FROM products WHERE id = ${prodId}`
            const sql2 = `UPDATE products SET product_image = '${req.file.filename}' WHERE id = '${prodId}'`
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
router.get ("/showProdImg/:image", (req, res)=>{
  res.sendFile(`${uploadDir}/${req.params.image}`)
})


// DELETE USER
router.delete ("/delete/products", (req, res) => { 
  const sql = `DELETE FROM products WHERE id = ?`
  const data = req.body.id

  conn.query(sql, data, (err, result) => {
      if(err) return res.send(err)

      res.send(result)
  })
}) 

// DELETE IMAGE ON FOLDER
router.delete("/delete/prodImg", (req, res) => { 
  const sql = `SELECT product_image FROM products WHERE id = '${req.body.id}'` // Get avatar column from user
  const sql2 = `UPDATE products SET product_image = null WHERE id = '${req.body.id}'` // Set null on avatar column
  const sql3 = `SELECT * FROM products WHERE id = '${req.body.id}'` // Get updated user
  conn.query(sql, (err, result) => {
      if(err) return res.send(err)

      // const product_image = result[0].product_image // Get avatar column

      // const imgPath = uploadDir + product_image // File location
      
      fs.unlink(`${uploadDir}/${result[0].product_image}`, err => { // Delete file avatar
      //fs.unlink(imgPath, err => { // Delete file avatar
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
}) ,




// Delete last_name in users table


// // Post Avatar/foto pada user yang fotonya disimpan pada file uploads dan nama file nya ditampilkan pada tabel users
// router.post("/upstore", upstore.single("avatar"), (req, res) => {
//   const sql = `SELECT * FROM users WHERE username = ?`;
//   const sql2 = `UPDATE users SET avatar = '${
//     req.file.filename
//   }'WHERE username = '${req.body.uname}'`;
//   const data = req.body.uname;

//   conn.query(sql, data, (err, result) => {
//     if (err) return res.send(err);

//     conn.query(sql2, (err, result) => {
//       if (err) return res.send(err);

//       res.send({ filename: req.file.filename });
//     });
//   });
// });

// // Delete Avatar/foto pada user yang fotonya disimpan pada file uploads dan nama file nya ditampilkan pada tabel users diset menjadi null
// router.post("/deleteavatar", (req, res) => {
//   const username = req.body.username;
//   var sql = `SELECT * FROM users WHERE username =  '${username}'`;
//   var sql2 = `UPDATE users SET avatar = NULL WHERE username = '${username}'`;

//   conn.query(sql, (err, result) => {
//     if (err) return res.send(err);

//     fs.unlink(`${uploadDir}/${result[0].avatar}`, err => {
//       if (err) throw err;

//       conn.query(sql2, (err, result) => {
//         if (err) return res.send(err);

//         res.send(result);
//       });
//       console.log(`${result[0].avatar}, telah dihapus`);
//     });
//   });
// });

// router.get('/upstore/:imgName', (req, res) => { 
//   const options = {
//       root: uploadDir
//   }

//   var fileName = req.params.imgName

//   res.sendFile(fileName, options, (err) => {
//       if(err) return console.log(err);
      
//       console.log('Sent: ', fileName);
      
//   })
// } 
// ) 









module.exports = router;


