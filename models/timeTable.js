const {Schema,model} = require('mongoose')

const timeTable = new Schema({
    _id:{type:String,required:true},
    schedule:Array
})

module.exports = model('TimeTable',timeTable)

