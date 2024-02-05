// requiring express
const express =require('express');
const otpGen=require('../../models/onetimepassword/phoneotp');



// using express router

// eslint-disable-next-line new-cap
// register.js



const router = express.Router();

router.post('/get-otp', (req, res) => {
    console.log('minnu');
    console.log(req.body);
    otpGen.otpGenerate('9747491562') // Use otpGenerate from the imported object
        .then((result) => {
            console.log(result + 'ashannaaaaaaaaaaaaaaaaaaaaaaaa');
        })
        .catch((err) => {
            console.log(err);
        });
    res.json('radhamani appa');
});

module.exports = router;
