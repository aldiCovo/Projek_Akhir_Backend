const router = require("express").Router();
const conn = require("../config/connection");

// GET ONGKIR by shipment Id
router.get("/getPayment/paymentId/:paymentId",  (req, res) => {
    const {paymentId} = req.params
    const sql2 = `SELECT bank, no_rek FROM payment WHERE id = '${paymentId}'`;

    conn.query(sql2, (err, result) => {
      if (err) return res.send(err.sqlMessage);
      return res.send(result);
    });
  });

  module.exports = router;