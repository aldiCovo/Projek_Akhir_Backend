const router = require("express").Router();
const conn = require("../config/connection");
const multer = require("multer");
const path = require('path') // Menentukan folder uploads
const fs = require('fs') // menghapus file gambar

// GET ALL TRANSAKSION PER OPC

router.get("/getAllDataTrans/opc",  (req, res) => {
 
    const sql2 = `SELECT * FROM orders_per_cart `;
  
    conn.query(sql2, (err, result) => {
      if (err) return res.send(err.sqlMessage);
      return res.send(result);
    });
  });



// GET ALL TRANSAKSION PER PRODUCT

router.get("/getAllDataTrans/product",  (req, res) => {
 
    const sql2 = `SELECT 
                  u.username, 
                  p.product_artist, p.product_tittle, p.product_price, p.product_image,
                  o.qty, o.total_price, o.orders_id
                  FROM orders o JOIN users u ON o.user_id = u.id
                  JOIN products p ON o.product_id = p.id
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