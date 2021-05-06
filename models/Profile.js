const mongoose = require('mongoose');
var Schema=mongoose.Schema;
//验证用户是否填写
const ProfilesSchema = new Schema({
    type:{
        type:String,
    },
    descript:{
        type:String,
        required:true,
    },
    income:{
        type:String,
        required:true,
    },
    expend:{
        type:String,
        required:true,
    },
    cash:{
        type:String,
        required:true,
    },
    remark:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now,
    }
});



module.exports= Profiles = mongoose.model("profiles",ProfilesSchema)