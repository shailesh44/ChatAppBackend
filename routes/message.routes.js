const express = require("express")
const router = express.Router();
const messageController = require('../controller/messageController');
const upload = require('../middlewers/upload');


router.post("/send", upload.single('file'), messageController.sendMessage);
// router.post("/receive", messageController.readMessage);

module.exports = router;