const Post = require('../models/post');

exports.createPost = async (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });

    try {
        const newPost = await post.save();
        res.status(201).json({
            message: 'post has been successfully added',
            data: newPost
        })
    } catch (error) {
        res.json(500).json({
            message: 'Could not create the post',
            data: null
        });
    }
};

exports.getPosts = (req, res, next) => {

    const pageSize = +req.query.size;
    const currentPage = +req.query.page;
    
    let fetchedPosts;
    const postQuery = Post.find();
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }

    postQuery
        .then(posts => {
            fetchedPosts = posts;
            return Post.count();
        })
        .then(count => {
            res.status(200).json({
                message: 'posts have been successfully fetched',
                count: count,
                data: fetchedPosts
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error fetching data',
                data: null
            });
        })
};

exports.getPost = async (req, res, next) => {
    const postId = req.params.id;
    try {
        const post = await Post.findById(postId);
        res.status(200).json({
            message: 'post has been successfully retrieved',
            data: post
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching data',
            data: null
        });
    }
};

exports.updatePost = (req, res, next) => {
    
    let post = req.body;
    // check if new image is uploaded
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        post = {...post, imagePath: url + '/images/' + req.file.filename};
    }

    const postId = req.params.id;
    Post.updateOne({_id: postId, creator: req.userData.userId}, post)
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({
                    message: 'Successfully updated'
                });
            } else {
                res.status(401).json({
                    message: 'Unauthorized'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error updating the post',
                data: null
            });
        });
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.id;

    Post.deleteOne({_id: postId, creator: req.userData.userId})
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({
                    message: 'Post successfully deleted'
                });
            } else {
                res.status(401).json({
                    message: 'Unauthorized'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Could not delete the post',
                data: null
            });
        });
};
