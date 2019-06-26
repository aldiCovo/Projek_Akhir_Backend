const router = require("express").Router();
const conn = require("../config/connection");
//const multer = require("multer");
//const path = require('path') // Menentukan folder uploads
//const fs = require('fs') // menghapus file gambar


// // Upload Product Image
// const uploadDir = path.join(__dirname + '/../uploads/bukti_trf/' )
// const storagE = multer.diskStorage({
//     // Destination
//     destination : function(req, file, cb) {
//         cb(null, uploadDir)
//     },
//     // Filename
//     filename : function(req, file, cb) {
//         cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
//     }
// })
// const upstore = multer ({
//     storage: storagE,
//     limits: {
//         fileSize: 10000000 // Byte
//     },
//     fileFilter(req, file, cb) {
//         if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
//             return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
//         }

//         cb(undefined, true)
//     }
// })


// // Post Product Data to DB
// router.post("/postOrder",  upstore.single('product_image'), async (req, res) => {
 
//     try {
//       const {
//         user_id,
//         product_id,
//         address_id,
//         cart_id,
//         payment_stat,
//         shipment_stat,
//         orders_stat
//       } = req.body;
     
//             // Kondisi jika user update data user beserta avatar
//             const sql = `INSERT INTO orders SET  
                 
//             user_id   = '${user_id}',
//             product_id   = '${product_id}',
//             address_id  =  '${address_id}',
//             cart_id   = '${cart_id}',
//             payment_stat   = '${payment_stat}',
//             shipment_stat   = '${shipment_stat}',
//             orders_stat   = '${orders_stat}',
//             bukti_trf  = '${req.file.filename}'`;
             
//               const sql3 = `SELECT * FROM orders `
             
//               conn.query(sql, (err, result)=>{
//               if (err) return res.send(err)
//                 // res.send({filename: req.file.filename})
//                 conn.query(sql3, (err, result) => {
//                   if (err) return res.send(err)
//                   return res.send(result)
               
//               })
              
//          })
         
//      // console.log(req.file);
           
//   } catch (e) {
//       res.send(e)
//   }
//   })
  
router.post("/postOrderPerCart", async (req, res) => {

    const sql = "INSERT INTO orders_per_cart SET ? ";
    const sql2 = `SELECT * FROM orders_per_cart `
    const data = req.body;
  
    conn.query(sql, data, (err, result) => {
  
      if (err) return res.send(err);
  
      conn.query(sql2, data, (err, result) => {
        if (err) return res.send(err.sqlMessage);
        res.send(result);
      });

     
    });


})


router.delete("/deleteOrder/:", async (req, res) => {

    const sql = "INSERT INTO orders SET ? ";
    const sql2 = `SELECT * FROM orders `
    const data = req.body;
  
    conn.query(sql, data, (err, result) => {
  
      if (err) return res.send(err);
  
      conn.query(sql2, data, (err, result) => {
        if (err) return res.send(err.sqlMessage);
        res.send(result);
      });

     
    });


})





module.exports = router;