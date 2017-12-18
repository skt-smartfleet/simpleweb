var Auth = require('../models/smartfleet/auth');

exports.auth = function(req, res, next){
  var id = req.body.user_id;
  var pwd = req.body.user_pwd;
  Auth.login(req.body, function(result, data){
    if(result && typeof data.errorCode == 'undefined' ){
      res.json(data);
    }
    else res.status(500).send({ error: 'Login failed!' , detail : data});
  });
};
