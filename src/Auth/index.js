const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nanoid = require('nanoid');


router.post('/register', (req, res) => {
    const UserModel = mongoose.model('UserModel');
    // create the user
    let user = new UserModel();
    user.username = req.body.username;
    user.password = req.body.password;

    user.save((err, result) => {
        if (err)
            res.json(err);

        res.json(result);
    });
});

router.post('/login', (req, res) => {
    console.log('Requesting login:', req.body.username,req.body.password);

    const UserModel = mongoose.model('UserModel');

    if(!req.body || !req.body.username || !req.body.password) {
        res.json({err:'invalid request'});
    }
    UserModel.findOneAndUpdate({
        username: req.body.username,
        password: req.body.password
    },{$set:{token:nanoid()}}, {new:false}, (err, result) => {
        if (err || result == null) {
            res.json(err || {message:'User does not exist'});
            return false;
        }

        console.log(result);

        res.json({
            token:result.token,
            message: 'Success'
        });
    })
});

router.post('/logout', (req, res) => {
    
    const UserModel = mongoose.model('UserModel');
    let params = {token: req.body.token};
    UserModel.findOneAndUpdate(params, {$set:{token:false}}, {new:true}, (err, result) => {
        if(err || result == null) {
            res.json(err || {message: 'User is not logged in'})
        }

        res.json({
            message: 'User has been logged out',
            user: result.username
        });
    })
});
module.exports = router;