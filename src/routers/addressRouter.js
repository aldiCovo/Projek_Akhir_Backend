const router = require("express").Router();
const conn = require("../config/connection");



// ADD USER ADDRESS (POST DATA USER TO DB)
router.post("/addAddress/:userId", async (req, res) => {
    req.body.user_id = req.params.userId
    //userId = req.params.user_id
    //const {userId} = req.params
    const sql = "INSERT INTO address SET ? ";
    //const sql = `INSERT INTO address SET ? WHERE user_id = '${userId}'  `;
    const data = req.body;
  
    if (req.body.phone === null) return res.send("please enter phone number");
    
    conn.query(sql, data, (err, result) => {
  
      if (err) return res.send(err);
  
      res.send(result);
    });
  });

  // GET ADDRESS USER by UserId
router.get("/getuserAddress/:userId",  (req, res) => {
    const {userId} = req.params
    const sql2 = `SELECT * FROM address WHERE user_id = '${userId}'`;
  
    conn.query(sql2, (err, result) => {
      if (err) return res.send(err.sqlMessage);
      return res.send(result);
    });
  });

  // Edit User Address by UserId
router.patch("/updateaddress/:userId", async (req, res) => {
    Object.keys(req.body).forEach(key=>{
      if(!req.body[key]){
        delete req.body[key]
      }
    })
    const sql = "UPDATE address SET ? WHERE user_id = ?";
    const data = [req.body, req.params.userId];
  
    if (req.body.phone === null) return res.send("please enter phone number");
    
    conn.query(sql, data, (err, result) => {
  
      if (err) return res.send(err);
  
      res.send(result);
    });
  });

  
  module.exports = router;