const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user')

module.exports = function (app) {

    // CREATE Comment
    app.post("/posts/:postId/comments", function (req, res) {
        // INSTANTIATE INSTANCE OF MODEL
        const comment = new Comment(req.body);

        comment.author = req.user._id
        

        // SAVE INSTANCE OF Comment MODEL TO DB
        comment
            .save()
            .then(comment => {
                return Post.findById(req.params.postId)
            })
            .then(post => {
                post.comments.unshift(comment);
                return post.save()
            })
            .then(() => {
                return User.findById(req.user._id)
            })
            .then(user => {
                user.comments.unshift(comment)
                return user.save()
            })
            .then(() => {
                res.redirect(`/`);
            })
            .catch(err => {
                console.log(err);
            });
    });

};