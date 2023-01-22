const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");
const sequilize = require('../config/connection');


// Get all posts.
router.get("/", async (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'post_content',
            'title',
            'created_at'
        ],
        include: [{
            model: Comment,
            attributes: [
                'id',
                'comment_content',
                'user_id',
                'post_id',
                'created_at'
            ],
            include: {
                model: User,
                attributes: ['username']
            }
        }]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        // renders data to the homepage
        res.render('homepage', {posts, logged_in: req.session.logged_in});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// =====================================================
router.get("/login", (req, res) => {
    if (req.session.logged_in) {
        res.redirect("/");
    return;
    }

    res.render("login");
});

// router.get("/register", (req, res) => {
//     if (req.session.loggedIn) {
//         res.redirect("/");
//     return;
//     }

//     res.render("register");
// });
// =====================================================

router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_content',
            'title',
            'created_at',
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_content', 'post_id', 'user_id', 'created_at'],
                include: {
                    mode: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })

    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({ message: 'No post from this user'});
            return;
        }

        const post = dbPostData.get({ plain: true });

        res.render('singlePost', { post, logged_in: req.session.logged_in})
    })
})

module.exports = router;