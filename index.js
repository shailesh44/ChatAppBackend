require("dotenv").config();
const express = require('express')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const smartContractRoute = require('./routes/smartcontract')
//socket
const server = require("http").createServer(app);
require("./config/socket").configure(server, app);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
app.use(express.json());

// if (typeof web3 !== 'undefined') {
//     var web3 = new Web3(web3.currentProvider);
// } else {
//     var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
// }
// const accounts = await web3.eth.getAccounts();
// const contactList = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);
  

app.use("/api", smartContractRoute);
app.use("/msg", require("./routes/message.routes"));

server.listen(process.env.PORT || 3001, () => {
    console.log('listening on port ' + (process.env.PORT || 3001));
});