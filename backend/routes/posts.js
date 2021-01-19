const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const extractFile = require('../middlewares/file');
const PostController = require('../controllers/PostController');

const router = express.Router();

router.post('', checkAuth, extractFile, PostController.createPost);

router.get('', PostController.getPosts);

router.get('/:id', PostController.getPost);

router.put('/:id', checkAuth, extractFile, PostController.updatePost);

router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;
