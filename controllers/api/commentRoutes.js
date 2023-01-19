const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Finds all comments.
router.get('/', (req, res) => {
    Comment.findAll({})
    .then(commentData => res.json(commentData))
    // catches err
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Creates a comment