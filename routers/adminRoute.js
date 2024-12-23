const express = require('express')
const db = require("../model/databaseTable");
const { promisify } = require('util');
const query = promisify(db.query).bind(db);
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');



let appName = "Mr & miss unical 24/25"


// admin Page
router.get('/', ensureAuthenticated, async (req, res) => {

  try {
    const { rows: contestants } = await query('SELECT * FROM "contestants"');
    const { rows: votesClaims } = await query('SELECT * FROM "votesClaims"');

    res.render('admin', {
      appName,
      contestants,
      allVotes: votesClaims,
      votesClaims,
    });


  } catch (error) {
    console.log(error);
    req.flash('error_msg', "error from server ")
    return res.redirect('/admin')
  }
})

router.get('/all-votes', ensureAuthenticated, async (req, res) => {

  try {
    const { rows: votesClaims } = await query(`SELECT * FROM "votesClaims" WHERE is_approved = false`);

    res.render('admin-all-votes', {
      appName,
      votesClaims,
    });


  } catch (error) {
    console.log(error);
    req.flash('error_msg', "error from server ")
    return res.redirect('/admin')
  }
})

router.get('/new-votes', ensureAuthenticated, async (req, res) => {

  try {

    const { rows: votesClaims } = await query(`SELECT * FROM "votesClaims" WHERE is_approved = false`);

    res.render('admin-new-votes', {
      appName,
      votesClaims,
    })
  } catch (error) {
    console.log(error);
    req.flash('error_msg', "error from server ")
    return res.redirect('/admin')
  }
})

router.get('/approved-votes', ensureAuthenticated, async (req, res) => {

  try {
    const { rows: votesClaims } = await query(`SELECT * FROM "votesClaims" WHERE is_approved = true`);

    res.render('admin-approved-votes', {
      appName,
      votesClaims,
    });
  } catch (error) {
    console.log(error);
    req.flash('error_msg', "error from server ")
    return res.redirect('/admin')
  }
})

router.get('/queried-votes', ensureAuthenticated, async (req, res) => {

  try {
    const { rows: votesClaims } = await query(`SELECT * FROM "votesClaims" WHERE is_approved = false AND status = $1`, ['query']);

    res.render('admin-queried-votes', {
      appName,
      votesClaims,
    });

  } catch (error) {
    console.log(error);
    req.flash('error_msg', "error from server ")
    return res.redirect('/admin')
  }
})






router.get('/contestants', ensureAuthenticated, async (req, res) => {

  try {
    const { rows: contestants } = await query('SELECT * FROM "contestants"');
    res.render('admin-contestants', {
      appName,
      contestants,
    });


  } catch (error) {
    console.log(error);
    req.flash('error_msg', "error from server ")
    return res.redirect('/admin')
  }
})

router.get('/view-contestant/:id', ensureAuthenticated, async (req, res) => {
  const id = req.params.id
  try {

    const { rows: voteFor } = await query('SELECT * FROM "contestants" WHERE id = $1', [id]);
    if (voteFor.length <= 0) {
      req.flash('error_msg', "no contestants registered")
      return res.redirect('/admin')
    }
    res.render('admin-contestant-data', {
      appName,
      voteFor,
    });


  } catch (error) {
    console.log(error);
    req.flash('error_msg', "error from server ")
    return res.redirect('/admin')
  }
})

router.put('/edit-contestant/:id', ensureAuthenticated, async (req, res) => {
  const id = req.params.id

  try {
    // update contenstants provided fields with req.body where id = params.id

    const { rows: voteFor } = await query('SELECT * FROM "contestants" WHERE id = $1', [id]);

    console.log("updating user under construction");


  } catch (error) {
    console.log(error);
    req.flash('error_msg', "error from server ")
    return res.redirect('/admin')
  }

})



router.get('/view-vote/:id', ensureAuthenticated, async (req, res) => {
  const id = req.params.id
  try {

    const { rows: singleClaims } = await query('SELECT * FROM "votesClaims" WHERE id = $1', [id]);

    if (singleClaims.length <= 0) {
      req.flash('error_msg', "no claim registered")
      return res.redirect('/admin')
    }
    res.render('admin-vote-data', {
      appName,
      singleClaims: singleClaims[0],
    });


  } catch (error) {
    console.log(error);
    req.flash('error_msg', "error from server ")
    return res.redirect('/admin')
  }
})


router.put('/accept-vote/:id', ensureAuthenticated, async (req, res) => {
  const id = req.params.id

  try {

    const { rows: singleClaims } = await query('SELECT * FROM "votesClaims" WHERE id = $1', [id]);
    const { rows: contestant } = await query('SELECT * FROM "contestants" WHERE id = $1', [singleClaims[0].contestant_id]);

    const oldVote = contestant[0].vote_count
    const newVote = oldVote + singleClaims[0].vote_count

    // update status to verified where id = id
    // update is approved to true where id = id


    req.flash('success_msg', ` old vote was ${oldVote} and new total vote is ${newVote}`)
    return res.redirect('/admin')

  } catch (error) {
    console.log(error);
    req.flash('error_msg', "error from server ")
    return res.redirect('/admin')
  }
})


router.put('/query-vote/:id', ensureAuthenticated, async (req, res) => {
  try {
    const id = req.params.id

    const { rows: singleClaims } = await query('SELECT * FROM "votesClaims" WHERE id = $1', [id]);

    // UPDATE is_approved to false
    // update status to "query"
    req.flash('warning_msg', `claim has been queried! `)
    return res.redirect('/admin')

  } catch (error) {
    console.log(error);
    req.flash('error_msg', "error from server ")
    return res.redirect('/admin')
  }
})

module.exports = router;