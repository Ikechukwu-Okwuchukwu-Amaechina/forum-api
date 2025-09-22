const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/threadController');
const auth = require('../middleware/auth');

router.post('/', auth, ctrl.createThread);
router.get('/', ctrl.listThreads);
router.get('/:id', ctrl.getThread);
router.delete('/:id', auth, ctrl.deleteThread);
router.post('/:id/comments', auth, ctrl.addComment);
router.post('/comments/:id/reply', auth, ctrl.replyComment);

// Voting
router.post('/:id/vote', auth, ctrl.voteThread);
router.post('/comments/:id/vote', auth, ctrl.voteComment);

module.exports = router;
