const {Schema,model} = require('mongoose')

const userSchema = new Schema({
    _id:{type:String,required:true},
    password:{type:String,required:true},
})

module.exports = model('User',userSchema)