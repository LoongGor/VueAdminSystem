const mongoose = require('mongoose');
var Schema=mongoose.Schema;
//验证用户是否填写
const userSchema = new Schema({
    //用户名:
    name:{
        type:String,
        required:true,//这一项是必填
    },
    //邮箱
    email:{
        type:String,
        required:true
    },
    //密码
    password:{
        type:String,
        required:true
    },
    //日期时间
    date:{
        type:Date,//日期类型
        default:Date.now //默认使用时间戳
    },
    //头像
    avatar:{
        type:String,
    },
    //身份信息
    identity:{
        type:String,
        required:true
    }
});



module.exports= User = mongoose.model("users",userSchema)