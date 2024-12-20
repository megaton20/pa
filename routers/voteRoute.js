const express = require('express')
const path = require('path')
const multer = require('multer');
const router = express.Router();
// const bcrypt = require('bcrypt');
const passport = require('../config/passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');



const upload = multer({ dest: 'uploads/' })

router.post('/upload-receipt', upload.single('receipt'), (req, res) => {
    const { fname, lname,trackingId, amount,contestantID, voteSum} = req.body;
    console.log(req.body);
    const status = "unverified"
    const is_approved = false

    // insert into vote_claims
    
    req.flash('success_msg', `${voteSum} vote(s) claim submited with ID "${trackingId}"`)
   return res.redirect('/contestants')



})

module.exports = router;