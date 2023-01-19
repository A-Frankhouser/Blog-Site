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
router.post('/', withAuth, (req, res) => {
    if(req.session){
    Comment.create({
        comment_content: req.body.comment_content,
        post_id: req.body.post_id,
        user_id: req.session.user_id
    })
    .then(commentData => res.json(commentData))
    // catches error.
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
    };
});

// Delete a comment
router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    }).then(commentData => {
        if(!commentData){
            res.status(404).json({ message: "Sorry, no comment found with this id!"});
            return;
        }
        res.json(commentData)
        // catches err.
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });  
});

module.exports = router;