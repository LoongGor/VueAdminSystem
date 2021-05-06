const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profiles = require('../../models/Profile.js');
const Profile = require('../../models/Profile.js');

// router.get('/',(req, res) =>{
//     res.json({
//         msg:'这个是profile数据'
//     })
// })
//添加数据
//这里类似做个路由拦截,当有权限的时候,再继续访问authentication;(意味着登录后返回Bearer +token,用这个token继续访问)
router.post('/add',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        // res.json({
        //     msg:'这个是profiles内容'
        // })
        const profilesFields = {};
        //判断数据
        if (req.body.type) { profilesFields.type = req.body.type }
        if (req.body.descript) { profilesFields.descript = req.body.descript }
        if (req.body.income) { profilesFields.income = req.body.income }
        if (req.body.expend) { profilesFields.expend = req.body.expend }
        if (req.body.cash) { profilesFields.cash = req.body.cash }
        if (req.body.remark) { profilesFields.remark = req.body.remark }
        //存储数据
        new Profiles(profilesFields)
            .save() //保存
            .then(Profiles => {
                res.json(Profiles)
            })
    }
)
//获取数据
router.get('/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profiles.find()
            //查值,如果有查导致的话,返回数据
            .then(Profiles => {
                if (!Profiles) {
                    return res.status(404).json('你所查找的内容不存在')
                };
                res.json(Profiles)
            })
            .catch(err => {
                res.status.json(err)
            })
    }
)
//修改数据
router.put('/edit/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        //匹配值的过程
        const profilesFields = {};
        if (req.body.type) { profilesFields.type = req.body.type }
        if (req.body.descript) { profilesFields.descript = req.body.descript }
        if (req.body.income) { profilesFields.income = req.body.income }
        if (req.body.expend) { profilesFields.expend = req.body.expend }
        if (req.body.cash) { profilesFields.cash = req.body.cash }
        if (req.body.remark) { profilesFields.remark = req.body.remark }
        //对修改后的数据进行跟新
        Profile
            .findOneAndUpdate(
                { _id: req.params.id }, //查到对应的id值
                { $set: profileFields },//更新数据
                { new: true },//是否需要进行实时更新
            )
            .then(profiles => res.json(profiles))
    }
)
//查找
router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        //查找数据
        Profile
            .findOne(
                { _id: req.params.id }, //查到对应的id值
            )
            //prfoiles参数是数据内容
            .then(profiles => {
                if (!profiles) {
                    res.status(404).json(`你所有查找的内容不存在`)
                    return;
                }
                res.json(profiles)

            })
            .catch(err => {
                res.status(404).json(err)
            })

    }

)
router.delete('/delete/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile
            .findByIdAndRemove({
                _id: req.params.id
            })
            .then(profile => {
                profile
                    .save()
                    .then(profile => { res.json(profile) })
            })
            .catch(err => {
                res.status(404).json('删除数据失败')
            })
    }
)

module.exports = router;