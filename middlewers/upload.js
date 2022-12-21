const multer = require("multer");
const ipfsClient = require( 'ipfs-http-client')
// import express from 'express'
const ipfs =  ipfsClient.create('/ip4/127.0.0.1/tcp/5001')
const  fs = require ('fs');




const imageFilter = (req, file, cb) => {
console.log(file);
  if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
    cb(null, true);
  } else {
    cb("Please upload only image file.", false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname+"../../files" )
  },

  filename: async (req, file, cb) => {
    console.log("--------->",file.originalname);
    req.body.fileName = file.originalname;

    // let fileHash = await ipfs.add(
    //     {
    //         path: 'files/image1.jpeg',  
    //     }, 
    //     { 
    //         wrapWithDirectory: true 
    //     }
    // );

    // console.log("Hash--->", fileHash);

    cb(null, file.originalname);
  },
});

// await ipfs.add

var uploadFile = multer({ storage: storage });
module.exports = uploadFile;