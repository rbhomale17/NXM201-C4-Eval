const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email:{type:String},
    password:{type:String},
    city:{type:String, default:'Wardha'}
});

const UserModel = mongoose.model('user',UserSchema);

module.exports = UserModel;