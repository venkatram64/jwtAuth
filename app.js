var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var app = express();
var secureRoutes = express.Router();


//controllers
var dataController = require('./server/controllers/data-controller');
var authenticateController = require('./server/controllers/authenticate-controller');
process.env.SECRET_KEY = "mysimplekey";

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/secure-api', secureRoutes);
var config = require('./server/config/config');
config.setConfig();

mongoose.connect(process.env.MONGOOSE_CONNECT);

app.get('/api/authenticate', authenticateController.authenticate);

app.get('/api/get-data', dataController.getData);
//validation middleware
secureRoutes.use(function(req, res, next){
  var token = req.body.token || req.headers['token'];
  if(token){
    jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
      if(err){
        return res.status(500).send("Invalid token.");
      }else{
        next();
      }
    });
  }else{
    res.send("please send a token.");
  }
})
secureRoutes.post('/post-data', dataController.postData);

app.listen(9000, function(){
  console.log("server is up on port # 9000");
});
