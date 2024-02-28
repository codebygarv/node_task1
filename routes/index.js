const express = require('express');
const router = express.Router();
const User = require('../models/User');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Task1' });
});

/* POST form data */
router.post('/save', function (req, res, next) {
  const { firstName, lastName, mobileNumber, email, street, city, state, country, loginId, password } = req.body;
  const user = new User({
    firstName,
    lastName,
    mobileNumber,
    email,
    address: { street, city, state, country },
    loginId,
    password
  });

  user.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error saving data: ' + err.message);
    });
});

/* GET users listing. */
router.get('/list', function (req, res, next) {
  User.find({})
    .then(users => {
      res.render('list', { users });
    })
    .catch(err => {
      console.error(err);
      res.send('Error retrieving data');
    });
});

router.post('/checkDuplicate', function (req, res, next) {
  const { email, loginId } = req.body;
  User.findOne({ email }, function (err, userWithEmail) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (userWithEmail) {
      return res.json({ existsEmail: true });
    }
    User.findOne({ loginId }, function (err, userWithLoginId) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (userWithLoginId) {
        return res.json({ existsLoginId: true });
      }
      res.json({ existsEmail: false, existsLoginId: false });
    });
  });
});

module.exports = router;
