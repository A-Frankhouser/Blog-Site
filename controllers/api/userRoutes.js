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

// GET api/user/id
router.get('/:id', (req, res) => {
    // Finds specific post by User
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            // Includes Post model.
            {
                model: Post,
                attributes: ['id', 'title', 'post_content', 'date_created']
            },
            // Includes Comment model.
            {
                model: Comment,
                attributes: ['id', 'comment_content', 'date_created'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })
    .then(userData => {
        // If cannot find userData.
        if (!userData) {
            res.status(400).json({ message: "Sorry, no user found with this id" })
            return;
        }
        res.json(userData);
    })
    // If there is an error it will console log the error.
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST user (creates User).
router.post('/', (req, res) => {
    // Creates a user.
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    // Stores the user data in the session.
    .then(userData => {
        req.session.save(() => {
            req.session.user_id = userData.id,
            req.session.username = userData.username,
            req.session.logged_in = true;

            res.json(userData);
        });
    });
});


// =========================================================================
// Post. Identifies a specific user.
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(userData => {
        if(!userData) {
            res.status(400).json({ message: "Sorry, cannot find the user with that email address :(" });
            return;
        }
        
        // Verifies the user by password.
        const correctPassword = userData.checkPassword(req.body.password);
        if(!correctPassword){
            res.status(400).json({ message: "Incorrect username or password. Please try again." });
            return;
        }
        req.session.save(() => {
            // Saves the session data.
            req.session.id = userData.id,
            req.session.username = userData.username,
            req.session.logged_in = true
        });
    });
});

// Logs a user out.
router.post('/logout', (req, res) => {
    if(req.session.logged_in) {
        res.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});
// =========================================================================