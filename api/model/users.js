const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    id: String,
    username: String,
    byOAuth: Boolean,
    hash: String,
    token: String,
    createdAt: String
}, {
    versionKey: false
})


const User = mongoose.model("User", UserSchema);

module.exports = User