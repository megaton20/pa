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
    const { rows: votesClaims } = await query('SELECT * FROM "votesClaims" WHERE is_approved = $1',[false]);
    const { rows: allVotes } = await query('SELECT * FROM "votesClaims"');

    res.render('admin', {
      appName,
      contestants,
      allVotes,
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
    const { rows: votesClaims } = await query(`SELECT * FROM "votesClaims" WHERE is_approved = false AND status != 'query'`);

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
  const id = req.params.id;
  const { fname, lname, bio } = req.body;

  // Validation: Ensure fname and lname are not empty
  if (!fname || !lname) {
    req.flash('error_msg', 'First name and last name cannot be empty.');
    return res.redirect('/admin');
  }

  try {
    // Update only fname, lname, and bio
    await query(
      `UPDATE "contestants" SET fname = $1, lname = $2, bio = $3 WHERE id = $4`,
      [fname, lname, bio, id]
    );

    req.flash('success_msg', 'Contestant updated successfully');
    return res.redirect('/admin');
  } catch (error) {
    console.log(error);
    req.flash('error_msg', "Error from server");
    return res.redirect('/admin');
  }
});



router.get('/view-vote/:id', ensureAuthenticated, async (req, res) => {
  const id = req.params.id
  try {

    const { rows: singleClaims } = await query('SELECT * FROM "votesClaims" WHERE id = $1', [id]);
    
    if (singleClaims.length <= 0) {
      req.flash('error_msg', "no claim registered")
      return res.redirect('/admin')
    }
    const { rows: contestant } = await query('SELECT * FROM "contestants" WHERE id = $1', [singleClaims[0].contestant_id]);
    res.render('admin-vote-data', {
      appName,
      singleClaims: singleClaims[0],
      contestant:contestant[0]
    });


  } catch (error) {
    console.log(error);
    req.flash('error_msg', "error from server ")
    return res.redirect('/admin')
  }
})


router.put('/accept-vote/:id', ensureAuthenticated, async (req, res) => {
  const id = req.params.id;

  try {
    // Fetch vote claim and contestant info
    const { rows: singleClaims } = await query('SELECT * FROM "votesClaims" WHERE id = $1', [id]);
    const { rows: contestant } = await query('SELECT * FROM "contestants" WHERE id = $1', [singleClaims[0].contestant_id]);

    // Get the old vote count and calculate the new one
    const oldVote = contestant[0].vote_count;
    const newVote = oldVote + singleClaims[0].vote_count;

    // Update the contestant's vote count
    await query('UPDATE "contestants" SET vote_count = $1 WHERE id = $2', [newVote, contestant[0].id]);

    // Update the claim to be approved
    await query('UPDATE "votesClaims" SET status = $1, is_approved = $2 WHERE id = $3', ['verified', true, id]);

    req.flash('success_msg', `Old vote was ${oldVote} and new total vote is ${newVote}`);
    return res.redirect('/admin');
  } catch (error) {
    console.log(error);
    req.flash('error_msg', "Error from server");
    return res.redirect('/admin');
  }
});

router.put('/query-vote/:id', ensureAuthenticated, async (req, res) => {
  try {
    const id = req.params.id;

    // Update the claim status and is_approved to false
    await query('UPDATE "votesClaims" SET status = $1, is_approved = $2 WHERE id = $3', ['query', false, id]);

    req.flash('warning_msg', `Claim has been queried!`);
    return res.redirect('/admin');
  } catch (error) {
    console.log(error);
    req.flash('error_msg', "Error from server");
    return res.redirect('/admin');
  }
});


module.exports = router;