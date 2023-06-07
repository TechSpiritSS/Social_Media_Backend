const {
  register,
  login,
  updateProfile,
  getAllUsers,
  updateOpenStatus,
  makeUserAdmin,
} = require('../controllers/userController');

const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');

const router = require('express').Router();

router.put('/update/:id', cookieJwtAuth, updateProfile);
router.post('/register', register);
router.post('/login', login);
router.get('/allUsers/:id', cookieJwtAuth, getAllUsers);
router.put('/updateOpenStatus/:userId', cookieJwtAuth, updateOpenStatus);
router.put('/makeUserAdmin/:userId', cookieJwtAuth, makeUserAdmin);

module.exports = router;
