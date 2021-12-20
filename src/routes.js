const router = require('express').Router();

const userValidator = require('./validators/userValidator');
const validatorHandler = require('./middlewares/validatorHandler');
const userController = require('./controllers/userController');
const { upload } = require('./middlewares/upload');

router.get('/', (req, res) => res.status(200).send('healthcheck OK'));
router.get('/me', userValidator.protect, userController.findMe);
router.post('/register', upload.single("profile"), userValidator.checkRegister(), validatorHandler, userController.register);
router.post('/login', userValidator.checkLogin(), validatorHandler, userController.login);
router.patch('/update', userValidator.protect, userController.updateUser);
router.patch('/password', userValidator.protect, userValidator.checkPassword(), validatorHandler, userController.changePassword);
router.patch('/profile', userValidator.protect, upload.single("profile"), userController.changeProfile);

module.exports = router;