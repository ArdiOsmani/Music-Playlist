const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { requireAuth, requireRole } = require('../middleware/JWTmiddleware');


router.get('/admin-logs', requireAuth, requireRole(['admin']), userController.getAdminLogs);

router.post('/', userController.createUser);

router.post('/login', userController.loginUser);

router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUserById);

router.put('/:id', requireAuth, requireRole(['admin']), userController.updateUser);

router.delete('/:id', requireAuth, requireRole(['admin']), userController.deleteUser);

module.exports = router;