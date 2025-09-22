const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/threadController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/threads', auth, roleCheck('admin'), ctrl.adminListThreads);
router.delete('/comments/:id', auth, roleCheck('admin'), ctrl.adminDeleteComment);

module.exports = router;
