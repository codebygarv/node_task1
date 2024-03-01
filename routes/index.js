const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'task1', errorMessage: req.session.errorMessage });

  // Clear the errorMessage after rendering the view
  req.session.errorMessage = null;
});

router.post('/save', async function (req, res, next) {
  const { firstName, lastName, mobileNumber, email, street, city, state, country, loginId, password } = req.body;

  try {
    // Check if email already exists
    const userWithEmail = await User.findOne({ email }).exec();
    if (userWithEmail) {
      // Email already exists, set error message and redirect
      req.session.errorMessage = 'Email already exists!';
      return res.redirect('/');
    }

    // Check if login ID already exists
    const userWithLoginId = await User.findOne({ loginId }).exec();
    if (userWithLoginId) {
      // Login ID already exists, set error message and redirect
      req.session.errorMessage = 'Login ID already exists!';
      return res.redirect('/');
    }

    // Neither email nor login ID exists, proceed with saving
    const user = new User({
      firstName,
      lastName,
      mobileNumber,
      email,
      address: { street, city, state, country },
      loginId,
      password
    });

    await user.save();
    req.session.successMessage = 'You have successfully signed up!';
    res.redirect('/list');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving data: ' + error.message);
  }
});

router.get('/list', function (req, res, next) {
  const successMessage = req.session.successMessage;
  delete req.session.successMessage; // Clear the success message after displaying it once
  const errorMessage = req.session.errorMessage;
  delete req.session.errorMessage; // Clear the error message
  User.find({})
    .then(users => {
      res.render('list', { users, successMessage, errorMessage });
    })
    .catch(err => {
      console.error(err);
      res.send('Error retrieving data');
    });
});

module.exports = router;
