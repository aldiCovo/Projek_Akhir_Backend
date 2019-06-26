const router = require("express").Router();
const conn = require("../config/connection");

// ADD CART 
router.post("/addCart", async (req, res) => {
    
    const sql = "INSERT INTO carts SET ? ";
    const sql2 = `SELECT * FROM carts `
    const data = req.body;
  
    conn.query(sql, data, (err, result) => {
  
      if (err) return res.send(err);
  
      conn.query(sql2, data, (err, result) => {
        if (err) return res.send(err.sqlMessage);
        res.send(result);
      });

     
    });
  });



// GET CART BY USER ID

router.get("/getCart/:userId", async (req, res) => {
    
    const {userId} = req.params

    
    const sql = `SELECT 
                c.id, c.user_id, c.product_id,
                u.first_name, u.last_name,
                p.product_artist, p.product_tittle, p.product_desc, p.product_genre, p.product_image, p.product_price, p.product_stock,
                c.qty
                FROM
                carts c JOIN users u ON c.user_id = u.id
                JOIN products p ON c.product_id = p.id
                WHERE c.user_id = ${userId}
                `
    
    conn.query(sql, (err, result) => {
      if (err) return res.send(err);
        // if (err) return res.send(err.sqlMessage);
        res.send(result);
      });
    });


// GET CART BY USER ID AND PRODUCT ID

router.get("/getCart/user/:userId/prod/:productId", async (req, res) => {
    
    const {userId, productId} = req.params

    
    const sql = `SELECT 
                c.id,
                u.first_name, u.last_name,
                p.product_artist, p.product_tittle, p.product_image, p.product_price,
                c.qty
                FROM
                carts c JOIN users u ON c.user_id = u.id
                JOIN products p ON c.product_id = p.id
                WHERE c.user_id = ${userId} AND c.product_id = ${productId}
                `
    
    conn.query(sql, (err, result) => {
      if (err) return res.send(err);
        // if (err) return res.send(err.sqlMessage);
        res.send(result);
      });
    });


// GET ALL CART 

router.get("/getAllCart", async (req, res) => {
    
    

    
    const sql = `SELECT 
                u.first_name, u.last_name,
                p.product_artist, p.product_tittle, p.product_image, p.product_price,
                c.qty
                FROM
                carts c JOIN users u ON c.user_id = u.id
                JOIN products p ON c.product_id = p.id
               
                `
    
    conn.query(sql, (err, result) => {
      if (err) return res.send(err);
        // if (err) return res.send(err.sqlMessage);
        res.send(result);
      });
    });
 

// EDIT QTY BY CART ID
router.patch("/updateCart/cartId/:cartId"  , (req, res) => {

  const {cartId} = req.params
  const sql = `UPDATE carts SET ? WHERE id = ${cartId}`
  const sql2 = `SELECT  * FROM carts WHERE id = ${cartId}`
  const data = req.body

  conn.query(sql, data, (err, result) => {
      if (err) return res.send (err)
          conn.query(sql2,(err, result) =>{
              if (err) return res.send(err);
              // if (err) return res.send(err.sqlMessage);
                  res.send(result);
          })
  }
  )
}

)


// DELET CART BY CART ID
router.delete("/deleteCart/:cartId"  , (req, res) => {

    const {cartId} = req.params
    const sql = `DELETE FROM carts WHERE id = ${cartId}`
    

    conn.query(sql, (err, result) => {
        if (err) return res.send (err)
                    res.send(result);      
    })
})


// EDIT QTY BY CART ID

router.patch("/updateCart/:cartId"  , (req, res) => {

    const {cartId} = req.params
    const sql = `UPDATE carts SET ? WHERE id = ${cartId}`
    const sql2 = `SELECT * FROM carts`
    const data = req.body
    conn.query(sql, data, (err, result) => {
        if (err) return res.send (err)
            conn.query(sql2,(err, result) =>{
                if (err) return res.send(err);
                // if (err) return res.send(err.sqlMessage);
                    res.send(result);
            })
    }
    )
}

)







  
module.exports = router;