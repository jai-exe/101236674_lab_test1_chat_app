const mongoose = require('mongoose')

const PrivateMessageSchema = new mongoose.Schema({
    from_user: {
        type: String
    },
    to_user: {
        type: String
    },
    message: {
        type: String
    },
    date_sent: {
        type: Date
    }
});

const PrivateMessage = mongoose.model("PrivateMessage", PrivateMessageSchema);

module.exports = PrivateMessage