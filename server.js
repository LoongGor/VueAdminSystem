const express = require('express');
const app = express();
const port = process.env.PORT || 5001;
const mongoose = require('mongoose');
const dbLink = require('./config/keys');
const profiles = require('./routes/api/profiles.js')
const users = require('./routes/api/user.js')
const bodyParser = require('body-parser');
const passport = require('passport');

//参数:url; mongoose.connect()最终返回一个promise
mongoose.connect(
    dbLink.mongoURL,
    {
        useNewUrlParser:true,
        useUnifiedTopology: true
    }
)
.then(_=>{
    console.log('数据库链接成功')
})
.catch(_=>{
    console.log('数据库链接失败')
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) =>{
    res.send('hello world')
})

//链接users的文件访问路由时候,在前面添加/api/users例如 e.g http://localhost:5000/api/users/register;app.use('路由',文件)
app.use('/api/users',users);
app.use('/api/profiles',profiles)

//验证的操作:结合passport与passport-jwt 2个模块结合起来操作
app.use(passport.initialize());
require('./config/passport')(passport)

app.listen(port,()=>{
    console.log(`${port} has been listening`)
})
