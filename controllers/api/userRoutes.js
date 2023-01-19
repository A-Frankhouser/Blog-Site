const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET api/user
router.get('/', (req, res) => {
    // Uses the User model to find user.
    User.findAll({
        // excludes the password.
        attributes: { exclude: ['password'] }
    })
    .then(userData => res.jason(userData))
    // Logs error if there is one.
    .catch( err => {
        console.log(err);
        res.status(500).json(err);
    });
});