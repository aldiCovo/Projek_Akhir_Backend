const express = require("express");
const userRouter = require("./routers/userRouter");
const cors = require("cors");

const app = express();
const port = 2020;

app.use(express.json());
app.use(cors());
app.use(userRouter);

//app.use(taskRouter);
// app.get("/", (req, res) => {
//   res.send(`<h1>running on Heroku port ${port}</h1>`);
// });

app.listen(port, () => {
  console.log("Running at ", port);
});
