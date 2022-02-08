const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    password: {
        type: String
    },
    createon: {
        type: Date
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;