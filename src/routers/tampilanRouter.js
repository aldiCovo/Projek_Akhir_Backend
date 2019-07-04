const router = require("express").Router();
const conn = require("../config/connection");
const multer = require("multer");
const path = require('path') // Menentukan folder uploads
const fs = require('fs') // menghapus file gambar




// Upload Product Image
const uploadDir = path.join(__dirname + '/../uploads/pic_tampilan/' )
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




// Mendapatkan Image Avatar dari folder uploads
router.get ("/showPicTampilan/:image", (req, res)=>{
    res.sendFile(`${uploadDir}/${req.params.image}`)
  })
  















































module.exports = router;
