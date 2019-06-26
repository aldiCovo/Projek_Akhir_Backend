const router = require("express").Router();
const conn = require("../config/connection");
const multer = require("multer");
const path = require('path') // Menentukan folder uploads
const fs = require('fs') // menghapus file gambar



// Upload Product Image
const uploadDir = path.join(__dirname + '/../uploads/bukti_trv/' )
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


// Post Bukti Trf Data to OPC tables
router.patch("/postBuktiTrf/:opcId",  upstore.single('bukti_trv'), async (req, res) => {
  
  try {
  
   
            //const {opcId} = req.params
            const opcId = req.params.opcId
            const sql = `UPDATE orders_per_cart SET  
                          bukti_trv='${req.file.filename}'
                          WHERE id=${opcId}
                        `
            const sql3 = `SELECT * FROM orders_per_cart 
                           
                       `
                      
                       
            //const data = req.body

             conn.query(sql, (err, result)=>{
            if (err) return res.send("err1"+err)
             
              conn.query(sql3, (err, result) => {
                if (err) return res.send("err2"+err)
                return res.send(result)
             
            })
            
       })
       
   // console.log(req.file);
       
       
    
} catch (e) {
    res.send(e)
}
})


// Mendapatkan bukti trv dari folder uploads/bukti_trv
router.get ("/showBuktiTrf/:image", (req, res)=>{
  res.sendFile(`${uploadDir}/${req.params.image}`)
})

// Get Bukti_Trf
router.get("/getBuktiTrf", (req, res) => {
  const sql = `SELECT * FROM users WHERE username = "${req.query.opc_id}"`
  
  conn.query(sql, (err, result) => {
      if(err) {
          return res.send(err.sqlMessage)
      }
      
      const bukti_trv = result[0].bukti_trv
      console.log(avatar);
      
      
      res.send(`http://localhost:2020/getBuktiTrf/${bukti_trv}`)
      console.log(`http://localhost:2020/getBuktiTrf/${bukti_trv}`);
  })
});

// GET NAMA bukti_trv by opc_id
router.get(`/getBuktiTrf/:opcId`, (req, res)=>{
  
  const{opcId} = req.params
  sql = `SELECT bukti_trv FROM orders_per_cart
        WHERE id=${opcId}`

        conn.query(sql, (err, result) => {
          if(err) {
              return res.send(err.sqlMessage)
            }
            res.send(result)
        })
    
})


router.get('/getBuktiTrf/:bukti_trv', (req, res) => {
  res.sendFile(uploadDir + '/' + req.params.bukti_trv)
})




// GET ALL TRANSAKSION PER OPC PER ID

router.get("/getAllDataTransUser/opc/:userId",  (req, res) => {
    
    const {userId} = req.params
    const sql2 = `SELECT * FROM orders_per_cart WHERE user_id = ${userId} `;
  
    conn.query(sql2, (err, result) => {
      if (err) return res.send(err.sqlMessage);
      return res.send(result);
    });
  });



// GET ALL TRANSAKSION PER PRODUCT PER ID

router.get("/getAllDataTransUser/product/:userId",  (req, res) => {
    const {userId} = req.params
    const sql2 = `SELECT 
                  u.username, 
                  p.product_artist, p.product_tittle, p.product_price, p.product_image,
                  o.qty, o.total_price, o.orders_id
                  FROM orders o JOIN users u ON o.user_id = u.id
                  JOIN products p ON o.product_id = p.id
                  WHERE user_id = ${userId}
                  `;
  
    conn.query(sql2, (err, result) => {
      if (err) return res.send(err.sqlMessage);
      return res.send(result);
    });
  });




// UPDATE STATUS by orders_per_cart id
router.patch(`/updateStatDataTrans/opc/:opcId`, async (req, res) => {
    Object.keys(req.body).forEach(key=>{
        if(!req.body[key]){
          delete req.body[key]
        }
      })
    
      const {opcId} = req.params
      const sql = `UPDATE orders_per_cart SET ? WHERE id =${opcId}`
      const sql2 =`SELECT * FROM orders_per_cart`
      const data = req.body

      conn.query(sql, data,(err, result)=>{
        if (err) return res.send(err);
        conn.query(sql2,(err, result)=>{
            if (err) return res.send(err);
            return res.send(result);
        })
      })
})





























    module.exports = router;