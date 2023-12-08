const Router = require('express').Router;
const userController = require('../controllers/user/index');
const { body } = require('express-validator');

const router = new Router();

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 3 }),
  userController.registration,
);
router.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 3 }),
  userController.login,
);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);

module.exports = router;
