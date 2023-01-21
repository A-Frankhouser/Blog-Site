const router = require('express').Router();
const sequilize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Page where all blogs from logged in User is displayed.
router.get('/', withAuth, (req, res) => {
    Post.findAll({
        // Uses session Id
        where: {
            user_id: req.session.user_id
        },

        attributes: [
            'id',
            'title',
            'post_content',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_content', 'user_id', 'post_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    // serializes the data
    .then(postData => {
        const posts = postData.map(post => post.get({ plain: true }));
        // renders it to the dashboard
        res.render('dashboard', { posts, logged_in: true })
    })
    // if there is an error, console.logs it.
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Gets a post by it's ID and allows User to edit it.
router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_id',
            'title',
            'created_at'
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_content', 'user_id', 'post_id', 'created_at' ],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
     // serializes the data
    .then(postData => {
        const post = postData.get({ plain: true });
        // Renders it to the editPost handlebar.
        res.render('editPost', { post, logged_in: true });
    })
    // Displays an error if there is one.
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// exports router
module.exports = router;