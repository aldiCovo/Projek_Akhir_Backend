const router = require("express").Router();
const conn = require("../config/connection");


// ADD STOCK (POST STOCK TO DB)
router.post("/addStocks/:prodId", async (req, res) => {
//router.post("/addStocks", async (req, res) => {
    req.body.product_id = req.params.prodId
    
    //const { stock } = req.body;

    //const sql = `INSERT INTO stocks SET product_id = '${stock}' `;
    //const sql2 = `UPDATE stocks SET stock = '${stock}' `;

    //const sql = "INSERT INTO stocks SET ? ";
    const sql = "INSERT INTO stocks SET ? ";
    const sql2 = `SELECT * FROM stocks`;
    const data = req.body;
  
   
    
    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err.sqlMessage);
            conn.query(sql2, (err, result) => {
                if (err) return res.send(err.sqlMessage);
                res.send(result);
              });
      });
  });







  // GET ADDRESS USER by UserId
router.get("/getStocks/:prodId",  (req, res) => {
    const {prodId} = req.params
    const sql2 = `SELECT * FROM stocks WHERE product_id = '${prodId}'`;
  
    conn.query(sql2, (err, result) => {
      if (err) return res.send(err.sqlMessage);
      return res.send(result);
    });
  });

  // Edit User Address by UserId
router.patch("/updateStocks/:prodId", async (req, res) => {
    Object.keys(req.body).forEach(key=>{
      if(!req.body[key]){
        delete req.body[key]
      }
    })
    const sql = "UPDATE stocks SET ? WHERE product_id = ?";
    const data = [req.body, req.params.userId];
  
    
    
    conn.query(sql, data, (err, result) => {
  
      if (err) return res.send(err);
  
      res.send(result);
    });
  });



module.exports = router;