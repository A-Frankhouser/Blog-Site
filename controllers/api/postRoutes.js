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
})