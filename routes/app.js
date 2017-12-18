var express = require('express');
var router = express.Router();
var apps_controller = require('../controllers/appsController');
var config = require('../config');

for(var i = 2; i< process.argv.length ; i++){
  if(process.argv[i].indexOf("--") == 0){
    let envVal = process.argv[i].split('=');
    let envKey = envVal[0].split('--');
    config[envKey[1]] = envVal[1];
  }
}

var tmap_url = 'https://apis.skplanetx.com/tmap/js?version=1&format=javascript&appKey='+config.appkey;
/* GET App listing. */
router.get('/', function(req, res, next){
    res.render('apps', { tmapUrl: tmap_url });
});

router.get('/set', apps_controller.set);
router.get('/update', apps_controller.update);
router.post('/rpc', apps_controller.rpc);

module.exports = router;
