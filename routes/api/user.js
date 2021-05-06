const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const passport = require('passport');

router.get('/', (req, res) => {
    res.json({
        msg: '这个是测试数据内'
    })
})
//注册
router.post('/register', (req, res) => {
    //匹配数据库,对应的邮箱是否被注册出查找内容findOne是mongoose的一个方法
    //如果已经被注册过的,user接收到的就是注册所有信息
    //如果没有被注册过的,那么user接收到的就是null
    //console.log(req.query);
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            console.log(user);//user最终返回值boolean值
            if (user) {
                return res.status(400).json('该邮箱已经被注册过了');
            } else {
                //使用到 avatar包头像 npm i avatar, npm i gravatar
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                })
                //如果没有被注册,开始编辑注册的信息
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    identity: req.body.identity,
                    avatar,

                })
                //创建完信息,接下来进行检测
                //需要用到bcryptjs (注册模块密码加密)
                //使用hash值加密
                bcrypt.genSalt(10, function (err, salt) {
                    //里面嵌套一个hash,加密后返回的值给密码
                    bcrypt.hash(newUser.password, salt, function (err, hash) {
                        if (err) throw err;
                        //console.log(hash)
                        newUser.password = hash;
                        //注册完成,进行保存
                        newUser.save()
                            .then(user => {
                                res.json(user)
                            })
                            .catch(err => err)
                    })
                })
            }
        })
})
//登录
router.post('/login', (req, res) => {
   
    console.log('resHeaders',res.setHeader)
    
    //登录的时候需要拿到邮箱和密码校验值
    const email = req.body.email;
    const pwd = req.body.password;

    User.findOne({
        email
    })
        .then(user => {
            console.log(user)
            //判断是否注册了,如果被注册了返回注册的数据
            if (!user) {
                //未被注册返回null
                //console.log('用户不存在')
                return res.status(400).json('用户不存在');
            } else {
                bcrypt.compare(pwd, user.password)
                    .then(isMatch => {
                        //isMatch 返回一个boolean值
                        //如果密码正确的话,返回true,密码错误返回false
                        if (isMatch) {
                            const rule = {
                                id: user.id,
                                name: user.name,
                                identity: user.identity,
                            }
                            //需要用到令牌(token)
                            //三个包 jsonwebtoken passport passport-jwt
                            jwt.sign(rule, "secret", { expiresIn: 60 * 60 }, (err, token) => {
                                if (err) {
                                    console.log('jwterr=>', err)
                                    return
                                };
                                res.json({
                                    success: true,
                                    token: 'Bearer' + token //1.逻辑 在login的时候生成一个token值;并且把它保存在rule里面作为密钥
                                })
                            })
                        } else {
                            return res.status(400).json('密码匹配错误')
                        }
                    })
            }
        })
        .catch(err => {
            console.log(err)
        })
})
//解密权限
router.get('/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        // res.json({
        //     msg:'当前页面!'
        // })
        //2.逻辑把解密的值拿过来,从passport文件中拿过来
        console.log('user.js=>', req.user)
        res.json({
            id: req.user.id,
            name: req.user.name,
            identity: req.user.identity,
            email: req.user.email
        })

    })

module.exports = router;