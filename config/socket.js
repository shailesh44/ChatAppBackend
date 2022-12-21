const socketManager = require('../manager/socketManager');
const {
    findUser,
    sendMessage,
    readMessage,
    userList // finding user by address 
} = require("../controller/SmartContract");


const { 
    CONNECTION,
    ONSEND,
    ONRECEIVE,
    DISCONNECT
} =  require("../constant")


const configure = async (server, app) => {
    const io = require("socket.io")(server, {
        cors: {
          origin: ["*"],    
          credentials: true,
        },
      });

      app.set('io', io);
      global.io = io;

    
      io.on(CONNECTION, async (socket) => {
        console.log("New socket connected! >>", socket.id);
        socketManager.socketIoConnection(io);
        // userList(socket.handshake.auth.id, {
        //   socketid: socket.id,
        // });
        
    // const messages = await readMessage(socket.handshake.auth.id);
    // if (messages.length !== 0) {
    //   messages.forEach((message) => {
    //     socket.emit('New message',ONRECEIVE, message);
    //   });
    // }

    // socket.on(ONSEND, async (message) => {
    //     if (message.to) {
    //       const to = await userList(message.to);
    //       const sockets = Array.from(await io.allSockets());
    //       if (sockets.includes(to.socketid)) {
    //         socket.to(to.socketid).emit('send event',ONRECEIVE, {
    //           message: message.message,
    //           to: message.to,
    //           timestamp: message.timestamp,
    //           from: message.from,
              
    //         });
    //       } else {
    //         sendMessage(message);
    //       }
    //     }
    //   });


//broadcast message
// socket.on('broadcast-message', (data) => {
//   console.log('📢 broadcast-message event >> ', data)
//   // appends message in chat container, with isSelf flag false
//   sendMessage(data, false)
// })      
    socket.on(DISCONNECT, () => {
  
        userList(
                // socketid: null,
          { socketid: socket.id },
          {
            accountstatus: Constants.INACTIVE,
          }
        );
      });
    });
  
    
}


exports.configure = configure;