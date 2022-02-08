const mongoose = require('mongoose');
const express = require('express')
const socket = require('socket.io')

const app = express();

const uri = "mongodb+srv://gbc:s3cr3t@cluster0.dhvqi.mongodb.net/labtest1_comp3133_101236674?retryWrites=true&w=majority";

mongoose.connect( uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(success => {
  console.log('Success Mongodb connection')
}).catch(err => {
  console.log('Error Mongodb connection')
});

app.listen(8081, () => { console.log('Server is running...') });
