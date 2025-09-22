const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/threadController');
const auth = require('../middleware/auth');

router.post('/:id/vote', auth, ctrl.voteComment);

module.exports = router;
