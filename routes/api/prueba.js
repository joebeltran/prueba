var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

function initPrueba(db) {
  var pruebaColl = db.collection('prueba');
  router.get('/', (req, res, next)=>{
    pruebaColl.find().toArray((err, prueba)=>{
      if(err){
        console.log(err);
        return res.status(404).json({"error":"Error al extraer prueba de la base de datos"});
      }
      return res.status(200).json(prueba);
    });
  }); // get all
  router.get('/:id', (req, res, next)=>{
    var id = new ObjectID(req.params.id);
    pruebaColl.findOne({"_id": id} , (err, doc)=>{
      if(err){
        console.log(err);
        return res.status(404).json({"error":"No se Puede Obtener prueba Intente de Nuevo"});
      }
      return res.status(200).json(doc);
    });//findOne
  }); // /:id

  router.post('/', (req, res, next)=>{
    var newPrueba = Object.assign(
      {},
      {
        "nombre":"",
        "tipo":"",
        "fechaCreated": new Date().getTime(),
        "views":0,
        "likes":0
      },
      req.body
    );
    pruebaColl.insertOne(newPrueba, (err, rslt)=>{
      if(err){
        console.log(err);
        return res.status(404).json({"error":"No se pudo agregar nueva prueba"});
      }
      if(rslt.ops.length===0){
        console.log(rslt);
        return res.status(404).json({ "error": "No se pudo agregar nueva prueba" });
      }
      return res.status(200).json(rslt.ops[0]);
    });
  });//post

  router.put('/:id', (req, res, next)=>{
    var query = {"_id":new ObjectID(req.params.id)};
    var update = {"$inc":{"views":1, "likes":1}};

    pruebaColl.updateOne(query, update, (err, rslt)=>{
      if (err) {
        console.log(err);
        return res.status(404).json({ "error": "No se pudo modificar prueba" });
      }
      
      return res.status(200).json(rslt);
    })
  }); // put

  router.delete('/:id', (req, res, next) => {
    var query = { "_id": new ObjectID(req.params.id) };
    pruebaColl.removeOne(query, (err, rslt) => {
      if (err) {
        console.log(err);
        return res.status(404).json({ "error": "No se pudo eliminar la prueba" });
      }

      return res.status(200).json(rslt);
    })
  }); // delete

  return router;
}

module.exports = initPrueba;