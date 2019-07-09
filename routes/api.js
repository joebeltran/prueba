var express= require('express');
var router = express.Router();

function initApi(db){
  var pruebaRoutes = require('./api/prueba')(db);
  router.use('/prueba', pruebaRoutes);
  return router;
}

module.exports = initApi;