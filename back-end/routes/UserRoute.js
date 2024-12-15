const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { requireAuth, requireRole } = require('../middleware/JWTmiddleware');


router.post('/', userController.createUser);

router.post('/login', userController.loginUser);

router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUserById);

router.put('/users/:id', requireAuth, (req, res, next) => {
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    next();
  }, userController.updateUser);



router.delete('/:id', requireAuth, requireRole(['admin']), userController.deleteUser);

module.exports = router;