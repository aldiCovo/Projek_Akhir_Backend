const express = require("express");
const userRouter = require("./routers/userRouter");
const addressRouter = require("./routers/addressRouter");
const productRouter = require("./routers/productRouter");
const cartRouter = require("./routers/cartRouter");
const shipmentRouter = require("./routers/shipmentRouter");
const paymentRouter = require("./routers/paymentRouter");
const orderRouter = require("./routers/orderRouter");
const orderPerCartRouter = require("./routers/orderPerCartRouter");
const adminDataTrans = require("./routers/adminDataTrans");
const userDataTrans = require("./routers/userDataTrans");
const tampilanRouter = require("./routers/tampilanRouter");
const cors = require("cors");

const app = express();
const port = 2020;

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(addressRouter);
app.use(productRouter);
app.use(cartRouter);
app.use(shipmentRouter);
app.use(paymentRouter);
app.use(orderRouter);
app.use(orderPerCartRouter);
app.use(adminDataTrans);
app.use(userDataTrans);
app.use(tampilanRouter);

//app.use(taskRouter);
// app.get("/", (req, res) => {
//   res.send(`<h1>running on Heroku port ${port}</h1>`);
// });

app.listen(port, () => {
  console.log("Running at ", port);
});
