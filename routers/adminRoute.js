const express = require('express')
// const path = require('path')
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');



let appName = "Mr & miss unical 24/25"


contestants = [
  {
    id:1,
  fname:"Francis",
  lname:"doe",
  photo_url:"/contestants/1.JPG",
  vote_count: 20,
  status:"active",
  bio:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus laborum sit doloremque, facilis voluptatem dignissimos quod rem voluptates, iure aliquam et nihil illum voluptatum accusantium quaerat! Officia, facilis veniam. Saepe?"

},
  {
    id:2,
  fname:"jenet",
  lname:"doe",
  photo_url:"/contestants/2.JPG",
  vote_count: 20,
  status:"active"
},
  {
    id:3,
  fname:"joseph",
  lname:"doe",
  photo_url:"/contestants/3.JPG",
  vote_count: 20,
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


voteFor = [
  {
    id:1,
  fname:"daavido",
  lname:"doe",
  photo_url:"/contestants/1.JPG",
  vote_count: 20,
  status:"active",
  bio:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus laborum sit doloremque, facilis voluptatem dignissimos quod rem voluptates, iure aliquam et nihil illum voluptatum accusantium quaerat! Officia, facilis veniam. Saepe?"
}]

const votesClaims = [
  {
    id:1,
    uuid:3263271613,
    email:'test1"gmail.com',
    fname:"franklin",
    lname:'pascal',
    status:'unverified',
    uploaded_receipt:true,
    uploaded_receipt_file:"dhddfd.jpg",
    is_approved:false,
    contestant_id:2,
    amount_paid:300,
    vote_count:3,
  },

  {
    id:2,
    uuid:3263271613,
    email:'test2"gmail.com',
    fname:"frac",
    lname:'all',
    status:'unverified',
    uploaded_receipt:false,
    uploaded_receipt_file:null,
    is_approved:false,
    contestant_id:2,
    amount_paid:300,
    vote_count:3,
  },

  {
    id:3,
    uuid:3263271613,
    email:'test3"gmail.com',
    fname:"john",
    lname:'duudud',
    status:'unverified',
    uploaded_receipt:false,
    uploaded_receipt_file:null,
    is_approved:false,
    contestant_id:2,
    amount_paid:300,
    vote_count:3,
  },

  {
    id:4,
    uuid:3263271613,
    email:'dadfa"gmail.com',
    fname:"daddy",
    lname:'yo',
    status:'unverified',
    uploaded_receipt:false,
    uploaded_receipt_file:null,
    is_approved:false,
    contestant_id:4,
    amount_paid:3000,
    vote_count:30,
  },

  {
    id:5,
    uuid:3263271613,
    email:'test5"gmail.com',
    fname:"test",
    lname:'name',
    status:'unverified',
    uploaded_receipt:false,
    uploaded_receipt_file:null,
    is_approved:false,
    contestant_id:2,
    amount_paid:300,
    vote_count:3,
  },

  {
    id:6,
    uuid:3263271613,
    email:'test66"gmail.com',
    fname:"brer",
    lname:'name',
    status:'unverified',
    uploaded_receipt:false,
    uploaded_receipt_file:null,
    is_approved:false,
    contestant_id:3,
    amount_paid:3000,
    vote_count:30,
  }
]


const singleClaims = [
  {
    id:4,
    uuid:3263271613,
    email:'dadfa@gmail.com',
    fname:"daddy",
    lname:'yo',
    status:'unverified',
    uploaded_receipt:true,
    uploaded_receipt_file:"hgjhdf.jpg",
    is_approved:false,
    contestant_id:4,
    amount_paid:3000,
    vote_count:30,
  }
]


// admin Page
router.get('/', (req, res) => {
  res.render('admin', {
    appName,
    contestants,
    allVotes:votesClaims,
    votesClaims,
  });
})

router.get('/all-votes', (req, res) => {

  // where status is unverified and is_approved = false
  res.render('admin-all-votes', {
    appName,
    votesClaims,
  });
})

router.get('/new-votes', (req, res) => {

  // where status is unverified and is_approved = false
  res.render('admin-new-votes', {
    appName,
    votesClaims,
  });
})

router.get('/approved-votes', (req, res) => {
  // where status is verified and is_approved = true
  res.render('admin-approved-votes', {
    appName,
    votesClaims,
  });
})

router.get('/queried-votes', (req, res) => {
  // where status is queried and is_approved = false
  res.render('admin-queried-votes', {
    appName,
    votesClaims,
  });
})




router.get('/contestants', (req, res) => {

  // select all contestants

  res.render('admin-contestants', {
    appName,
    contestants,
  });
})

router.get('/view-contestant/:id', (req, res) => {

  res.render('admin-contestant-data', {
    appName,
    voteFor,
  });
})

router.put('/edit-contestant/:id', (req, res) => {

  // get req.body and params
  // update contenstants provided fields with req.body where id = params.id

  console.log("updating user under construction");
  
})



router.get('/view-vote/:id', (req, res) => {
  res.render('admin-vote-data', {
    appName,
    singleClaims:singleClaims[0],
  });
})


router.put('/accept-vote/:id', (req, res) => {

  // select where id = id
  // get the old vote_count
  // add new vote to old vote
  // update the votecount
  // update status to verified where id = id
  // update is approved to true where id = id
  console.log("a vote has accepted... increament the vote");
  
})


router.put('/query-vote/:id', (req, res) => {
  // select where id = id
  // update status to query where id = id
  
  console.log("a vote has queried...");
  
})

module.exports = router;