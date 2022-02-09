const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

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
        type: Date,
        default: Date.now
    }
});
UserSchema.plugin(passportLocalMongoose);


let User = mongoose.model("User", UserSchema);

module.exports = mongoose.model('User');