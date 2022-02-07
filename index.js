const mongoose = require('mongoose');
const express = require('express')
const socket = require('socket.io')

const uri = "mongodb+srv://gbc:s3cr3t@cluster0.dhvqi.mongodb.net/labtest1_comp3133_101236674?retryWrites=true&w=majority";

mongoose.connect(uri);