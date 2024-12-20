const express = require('express')
// const path = require('path')
const router = express.Router();
const { promisify } = require('util');
const db = require("../model/databaseTable");
const query = promisify(db.query).bind(db);
const bcrypt = require('bcrypt');
const passport = require('../config/passport');
const { forwardAuthenticated } = require('../config/auth');


router.post('/register',forwardAuthenticated,  async (req, res) => {
  let errors = [];

const { email, password, passwordB } = req.body;

if (!(email && password && passwordB )) {
  errors.push({ msg: 'Enter all details' });
}

if (password !== passwordB) {
  errors.push({ msg: 'Passwords do not match' });
}


if (errors.length > 0) {
    return res.render('register', {
      errors,
      email,
      password
    });
  }


  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const results = await query('SELECT * FROM "users" WHERE email = $1', [email]);

    if (results.rows.length > 0) {
      errors.push({ msg: `User with this email: ${email} already exists.` });
      return res.render('register', {
        errors,
        email,
        password,
      });
    }

    let user_role = 'user'

    if (email.startsWith('become-an-admin-')) {
      user_role= 'admin'
    }
    if (email.startsWith('become-super-')) {
      user_role= 'super'
    }

    
 await query(`INSERT INTO "users" ( "email", "password", "user_role") 
      VALUES ($1, $2, $3) RETURNING id`,
      [
        email,
        hashedPassword,
        user_role
      ]
    );


    req.flash('success_msg', `"${email}" Registration successful`);
    return res.redirect('/login');

  } catch (error) {
    req.flash('error_msg', `Error from server: ${error.message}`);
    return res.redirect('/register');
  }
}
)

router.post('/login',forwardAuthenticated, async (req, res, next) => {

    passport.authenticate('local', async (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.render('login', {
          error_msg: info.message,
          theme:req.session.theme,
        });
      }

        req.login(user, err => {
          if (err) {
            next(err);
            req.flash('error_msg', `Try again`);
            return res.redirect('/');
          }
  
          req.flash('success_msg', `Welcome ${user.fname}`);
          return res.redirect('/handler');
        });

    })(req, res, next);
  })

module.exports = router;