const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    // console.log('Hello Posts!');
    Post.findAll({
        attributes: [
            'id',
            'post_content',
            'title',
            'date_created'
        ],
        // Orders the post by the date it was created in descending order.
        order: [['date_created', 'DESC']],
        include: [
            // Adds the username to the comment
            {
                model: Comment,
                attributes: ['id', 'comment_content', 'post_id', 'user_id', 'date_created'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            },
        ]
    })
    .then(postData => res.json(postData))
    .catch(err => {
        res.status(500).json(err);
    }); 
});

// GETs a single post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_content',
            'title',
            'date_created'
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_content', 'user_id', 'post_id', 'date_created'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(postData => {
        if(!postData) {
            res.status(404).json({ message: "Cannot find post with this id" });
            return;
        } 
        res.json(postData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Creates a post!
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        post_content: req.body.post_content,
        user_id: req.session.user_id
    })
    .then(postData => res.json(postData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Update a post.
router.put('/:id', withAuth, (req, res) => {
    Post.update({
        title: req.body.title,
        post_content: req.body.post_content
    },
    {
        where: {
            id: req.params.id
        }
    }).then(postData => {
        if(!postData){
            res.status(404).json({ message: "Sorry, no post found with this id!" });
            return;
        }
        res.json(postData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
