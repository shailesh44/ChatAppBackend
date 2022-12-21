var express = require("express");
var router = express.Router();
const multer  = require('multer');
const  upload=  require('../middlewers/upload')
// const upload = multer()

// import { check, validationResult } from "express-validator";
const { check, validationResult } = require("express-validator")
var controller = require('../controller/SmartContract')

// module.exports=function(app){

const {
    register,
    findUser,
    sendMessage,
    readMessage,
    //IpfsModel,
    updateRSAkey,
    userList


} = require("../controller/SmartContract");

router.post(
    "/register",

    [
        check("userName", "userName is required"),
        check("_RSA_Public_Key", "_RSA_Public_Key should be at least 8 char")
    ],
    register
);

router.post("/findUser",
    [check("userName", "userName is required")],
    findUser
);




router.post("/sendMessage",
    [check("to", "adress is required")],
    [check("_msg", "msg is required")],
    [check("msgType", "msg is required")]


    , sendMessage
);




router.post("/readMessage",
    [check("to", "address is required")], readMessage
);

router.put("/updateRSAkey",
    [check("newRSAkey", "newRSAkey ")], updateRSAkey
);

router.post("/userList",
    [check("userAddress", "Address is required")],
    userList
);

router.post("/IpfsModel", 
 upload.single('file'), controller.IpfsModel)

router.post("/sendMedia",
upload.single('file'), controller.sendMedia)
module.exports = router;
 
