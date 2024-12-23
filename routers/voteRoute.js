const express = require('express')
const path = require('path')
const db = require("../model/databaseTable");
const { promisify } = require('util');
const query = promisify(db.query).bind(db);
const multer = require('multer');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');



const upload = multer({ dest: 'uploads/' })

router.post('/upload-receipt', upload.single('receipt'), async(req, res) => {
    const { fname, lname,trackingId, amount,contestantID, voteSum} = req.body;

    
    const status = "unverified"
    const is_approved = false
    const fileName = req.file.originalname

    try {
        await query(
            `INSERT INTO "votesClaims" ("fname", "lname", "uuid","amount_paid","contestant_id","vote_count", "status", "is_approved", "uploaded_receipt_file") 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [fname, lname, trackingId, amount, contestantID, voteSum, status, is_approved, fileName]);

          req.flash('success_msg', `${voteSum} vote(s) claim submited with ID "${trackingId}"`)
         return res.redirect('/contestants')

    } catch (error) {

        console.log(error);
        req.flash('error_msg', `${voteSum} vote(s) claim not submited "`)
       return res.redirect('/')
    }



})

module.exports = router;