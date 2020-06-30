const {Schema,model} = require('mongoose')

const journal = new Schema({
    _id:{type:String,required:true},
    attendance:Array
})

module.exports = model('Journal',journal)

