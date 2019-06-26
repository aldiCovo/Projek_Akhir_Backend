const router = require("express").Router();
const conn = require("../config/connection");

// GET ONGKIR by shipment Id
router.get("/getOngkir/shipmentId/:shipmentId",  (req, res) => {
    const {shipmentId} = req.params
    const sql2 = `SELECT kurir, ongkir FROM shipmen WHERE id = '${shipmentId}'`;
  
    conn.query(sql2, (err, result) => {
      if (err) return res.send(err.sqlMessage);
      return res.send(result);
    });
  });

  module.exports = router;