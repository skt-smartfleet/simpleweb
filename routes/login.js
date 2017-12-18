var express = require('express');
var router = express.Router();
var login_controller = require('../controllers/loginController');

/* GET login listing. */
router.get('/', function(req, res, next){
    res.render('login', { title: 'login' });
});

router.post('/auth', login_controller.auth);

module.exports = router;
