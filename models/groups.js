const {Schema, model} = require('mongoose')

const group = new Schema({
    _id:{type:String,required:true},
    students: Array
})

module.exports = model('Group',group)

