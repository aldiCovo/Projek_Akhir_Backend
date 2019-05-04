const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "aldiluki89@gmail.com",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SCERET,
    refreshToken: process.env.REFRESH_TOKEN
  }
});

const mail = {
  from: "Aldi Lukito <aldiluki89@gmail.com>",
  //to: "reyhanrdty@gmail.com",
  to: "hanif.hkim@gmail.com",
  html: "<h1>Hallow kak </h1>",
  subjek: "Tes Keperawanan"
};

transporter.sendMail(mail, (err, res) => {
  if (err) return console.log(err.message);

  console.log("Email berhasil terkirim");
});

// module.exports = {
//     sendVerify
//   };
