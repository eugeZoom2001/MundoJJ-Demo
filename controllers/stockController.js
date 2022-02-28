const { createCustomResponse } = require("./responseObject");
const rubro = require("../model/rubro");
const articulo = require('../model/articulo')

// RUBROS

const getRubros = async (req, res) => {
  rubro
    .find()
    .then((rubros) => {
      return res.status(200).json(createCustomResponse("ok", rubros));
    })
    .catch((err) => {
      return res
        .status(200)
        .json(createCustomResponse("err", { data: "hubo un error" }));
    });
};
      
const getRubroById=(req,res) => {
   rubro.findOne({_id:req.params.id}).then((rubroBusc) => {
    return res.status(200).json(createCustomResponse("ok", rubroBusc));
   }).catch((err) => {
    return res
    .status(200)
    .json(createCustomResponse("err", {}));
   });
}    

const createRubro = (req, res) => {
  let rubroNuevo = new rubro(req.body);
  rubroNuevo
    .save()
    .then((result) => {
      return res
        .status(200)
        .json(createCustomResponse("ok", `rubro creado ${req.body.nombre}`));
    })
    .catch((err) => {
      return res
        .status(200)
        .json(createCustomResponse("err", `el rubro ya existe`));
    });
};

//Articulos


const getArticulos = async (req,res) => {
  articulo.
  find({},{__v:0}). 
  
  populate('rubro',['nombre']).
  populate('proveedor',['nombre']).
  then((result) => {
     
    return res
      .status(200)
      .json(createCustomResponse("ok", result))
   }).catch((err) => {
    return res
    .status(200)
    .json(createCustomResponse("error", "hubo un error"))
  });
  
}

const createArticulo = (req,res) => {
  
   const articuloNuevo =  new articulo(req.body) 
   articuloNuevo.save().then((result) => {
     return res.status(200).json(createCustomResponse("ok", `articulo creado`));
   }).catch((err) => {
     return res.status(401).json(createCustomResponse("err", "producto duplicado"));
   });
  
}


const updateArticulo=(req,res) => {
 
   articulo.findOneAndUpdate({_id:req.params.articulo},req.body) 
   .then((result) => {
    
     return res.status(200).json(createCustomResponse("ok", `actualizado`))
   }).catch((err) => {
     return res.status(200).json(createCustomResponse("err", `no existe`))
   });
 
}

const deleteArticulo = (req,res) => {
  articulo.findOneAndDelete({_id:req.params.articulo})
  .then((result) => {
      return res.status(200).json(createCustomResponse("ok", `borrado`))
}).catch((err) => {
  return res.status(200).json(createCustomResponse("err", `no existe`))
}); 
}

module.exports = {
  getRubros,
  getRubroById,
  createRubro,
  getArticulos,
  createArticulo,
  updateArticulo,
  deleteArticulo
};
