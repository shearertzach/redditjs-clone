const Post = require('../models/post');
const User = require('../models/user');

module.exports = app => {
    // CREATE
    app.post("/posts/new", (req, res) => {
        if (req.user) {
            var post = new Post(req.body);
            post.author = req.user._id
            
            post
            .save()
            .then(post => {
                return User.findById(req.user._id)
            })
            .then(user => {
                user.posts.unshift(post)
                user.save()

                res.redirect(`/posts/${post._id}`)
            })
            .catch(err => {
                console.log(err.message)
            })
        } else {
            return res.sendStatus(401); // UNAUTHORIZED
        }
    });

    app.get('/posts/new', (req, res) => {
        let currentUser = req.user

        res.render('posts-new', { currentUser })
    })

    app.get('/', (req, res) => {
        var currentUser = req.user;

        console.log(req.cookies)

        Post.find({}).lean().populate('author')
            .then(posts => {
                res.render('posts-index', { posts, currentUser });
            })
            .catch(err => {
                console.log(err.message);
            })
    })

    // SHOW
    app.get("/posts/:id", function (req, res) {
        let currentUser = req.user
        // LOOK UP THE POST
        Post.findById(req.params.id).lean()
        .then((post) => {
            res.render('posts-show', { post, currentUser })
        }).catch((err) => {
            console.log(err.message)
        })
    });

    app.get("/n/:subreddit", function (req, res) {
        Post.find({ subreddit: req.params.subreddit }).lean()
            .then(posts => {
                res.render("posts-index", { posts });
            })
            .catch(err => {
                console.log(err);
            });
    });
};