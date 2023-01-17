const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");


// Get all posts.
router.get("/", async (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'post_content',
            'title',
            'date_created'
        ],
        include: [{
            model: Comment,
            attributes: [
                'id',
                'comment_content',
                'user_id',
                'post_id',
                'date_created'
            ],
            include: {
                model: User,
                attributes: ['username']
            }
        }]
    })
    .then(postData => {
        const posts = postData.map(post => post.get({plain: true}));
        res.render('homepage', {posts, loggedIn: req.session.logged_in});
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
// =====================================================

router.get('post/:id', (req, res) => {
    Post.findOne({
        where: {
            id:req.params.id
        },
        attributes: [
            'id',
            'post_content',
            'title',
            'date_created',
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_content', 'post_id', 'user_id', 'date_created'],
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

    .then(postData => {
        if(!postData) {
            res.status(404).json({ message: 'No post from this user'});
            return;
        }

        const posts = postData.get({ plain: true });

        res.render('')
    })
})

module.exports = router;