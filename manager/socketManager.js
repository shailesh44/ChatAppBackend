let ioSocket = {};
var moment = require('moment');
moment().format(); 
const socketIoConnection = async function (io) {
    try {
        if (io) {
            ioSocket = io;
        }
    } catch (error) {
        return (error);
    }
}

const receive = async function (data ) {
// const timestamp = Number(new Date());
const time = moment(new Date()).utc().utcOffset("+05:30").format("X");

    try {
        if (data) {
            if (ioSocket) {
                global.ioSocket = ioSocket;
                if (global.ioSocket) {
                    global.ioSocket.emit(`receive${data.to}` ,{ "data":data ,"timstamp": time} );
                }
            }
        }
    } catch (error) {
        return (error);
    }
}
/**
 * send Message
 */

  const send = async function (data) {
     try {
         if (data) {
             if (ioSocket) {
                 global.ioSocket = ioSocket;
                 if (global.ioSocket) {
                     global.ioSocket.emit('send',{ "data":data});
               }
             }
         }
     } catch (error) {
        return (error);
     }
 }
/**
 * EXPORT MODULE
 */
module.exports = {
    socketIoConnection,
    receive,
    // send
}