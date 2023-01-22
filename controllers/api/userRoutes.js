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
    .then(dbUserData => res.jason(dbUserData))
    // Logs error if there is one.
    .catch(err => {
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
                attributes: ['id', 'title', 'post_content', 'created_at']
            },
            // Includes Comment model.
            {
                model: Comment,
                attributes: ['id', 'comment_content', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })
    .then(dbUserData => {
        // If cannot find userData.
        if (!dbUserData) {
            res.status(400).json({ message: "Sorry, no user found with this id" })
            return;
        }
        res.json(dbUserData);
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
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id,
            req.session.username = dbUserData.username,
            req.session.logged_in = true;

            res.json(dbUserData);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    }); 
});


// =========================================================================
// Post. Identifies a specific user. Logs User in.
router.post("/login", async (req, res) => {
    try {
        if (req.session.logged_in) {
        res.redirect("/dashboard");
        return;
    }
    // Searches for a user
    const userData = await User.findOne({ where: { email: req.body.email } });
    console.log(userData);

    if (!userData) {
        res
            .status(400)
            .json({ message: "Incorrect email or password, please try again" });
        return;
    }

    // Validates the password
    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
        res
            .status(400)
            .json({ message: "Incorrect email or password, please try again" });
        return;
    }

        req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.username = userData.username;
        req.session.logged_in = true;

        res.json({ user: userData, message: "You are now logged in!" });
    });
    } catch (err) {
        res.status(400).json(err);
    }
});



// Logs a user out.
router.post('/logout', (req, res) => {
    if(req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});
// =========================================================================

module.exports = router;