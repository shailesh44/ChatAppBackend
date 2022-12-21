const { request, response } = require('express');
const messageManager = require('../manager/messageManager');
const ResponseUtil = require('../utils/response.util')

/**
 *
 * API to send messages
 *
 **/
const sendMessage = async(request, response)=>{   
   let from  = request.body.from
   let to = request.body.to
   let _msg = request.body._msg
   let msgType = request.body.msgType
   let private_key  = request.body.private_key
   let fileName = request.body.fileName
   let timestamp = request.body.timestamp
   let toUserName = request.body.toUserName

 messageManager.sendMessage(request.body)
   .then((result)=> {
            if(result.error){
                response.send(ResponseUtil.error(500, result));
            }
            else{
                response.send(ResponseUtil.success(result));
            }
        })
        .catch((err)=> response.send(ResponseUtil.error(500, err)));
  
}

 
/**
 *
 * API to send  amount 
 *
 **/


/**
 * EXPORT MODULE
 */
module.exports = {
    sendMessage,
   
    // readMessage
}