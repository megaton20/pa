const express = require('express')
// const path = require('path')
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('../config/passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { name } = require('body-parser');


let appName = "Mr & miss unical 24/25"

contestants = [
  {
    id:1,
  fname:"Francis",
  lname:"doe",
  photo_url:"/contestants/1.JPG",
  vote_count: 2,
  status:"active"
},
  {
    id:2,
  fname:"jenet",
  lname:"doe",
  photo_url:"/contestants/2.JPG",
  vote_count: 200,
  status:"active"
},
  {
    id:3,
  fname:"joseph",
  lname:"doe",
  photo_url:"/contestants/3.JPG",
  vote_count: 300,
  status:"active"
},
  {
    id:4,
  fname:"king",
  lname:"doe",
  photo_url:"/contestants/4.JPG",
  vote_count: 20,
  status:"active"
},
  {
    id:5,
  fname:"mina",
  lname:"doe",
  photo_url:"/contestants/5.JPG",
  vote_count: 20,
  status:"active"
},

]


const voteFor =  {
    id:3,
  fname:"gift",
  lname:"junior",
  photo_url:"/contestants/3.JPG",
  vote_count: 20,
  status:"active"
}

// Welcome Page
router.get('/', async (req, res) => {
  res.render('index', {
    pageTitle: `Welcome to ${appName}`,
    appName,
    contestants,
  });
})

router.get('/contestants', async (req, res) => {
  res.render('contestants', {
    pageTitle: `Welcome to ${appName}`,
    appName,
    contestants,
  });
})


router.get('/contestants/:id/vote', async (req, res) => {

  res.render('vote', {
    contestants:voteFor,
  });
})

router.get('/standing', async (req, res) => {

  res.render('standing', {
    pageTitle: `Welcome to ${appName}`,
    appName,
    standings:contestants,
  });
})


router.get('/prizes',  (req, res) => {

  res.render('prizes', {
    pageTitle: `Welcome to ${appName}`,
    appName,
    contestants:[],
  });
})

router.get('/contact',  (req, res) => {
  res.render('contact', {
    pageTitle: `Welcome to ${appName}`,
    appName
  });
})



router.get('/login',forwardAuthenticated,  (req, res) => {

  res.render('login', {
    pageTitle: `login`,
    appName
  });
})

router.get('/register',forwardAuthenticated,  (req, res) => {

  res.render('register', {
    pageTitle: `login`,
    appName
  });
})



module.exports = router;