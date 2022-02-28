const { createCustomResponse } = require("./responseObject");
const proveedor = require("../model/proveedor");
const proveedorCta = require("../model/proveedorCta");

//PROVEEDORES

const getProveedores = async (req, res) => {
  proveedor
    .find()
    .then((proveedores) => {
      //console.log(proveedores);
      return res.status(200).json(createCustomResponse("ok", proveedores));
    })
    .catch((err) => {
      return res
        .status(200)
        .json(createCustomResponse("err", { data: "hubo un error" }));
    });
};

const getProveedorById = (req, res) => {
  proveedor
    .findOne({ _id: req.params.id })
    .then((provBusc) => {
      return res.status(200).json(createCustomResponse("ok", provBusc));
    })
    .catch((err) => {
      return res.status(200).json(createCustomResponse("err", {}));
    });
};

const createProveedor = (req, res) => {
  let provNuevo = new proveedor(req.body);
  provNuevo
    .save()
    .then((result) => {
      return res.status(200).json(createCustomResponse("ok", result));
    })
    .catch((err) => {
      return res.status(400).json(createCustomResponse("err", `ya existe`));
    });
};

const updateProveedor = (req, res) => {
  //console.log("params", req.params,"datos",req.body);
  proveedor
    .findOneAndUpdate({ _id: req.params.proveedor }, req.body)
    .then((result) => {
     
      return res.status(200).json(createCustomResponse("ok", `actualizado`));
    })
    .catch((err) => {
      return res.status(400).json(createCustomResponse("err", `no existe`));
    });
 
};

const deleteProveedor = (req, res) => {
  proveedor
    .findOneAndDelete({ _id: req.params.proveedor })
    .then((result) => {
      // Borrar el resumen de cuenta
      //then
      return res.status(200).json(createCustomResponse("ok", `borrado`));
    })
    .catch((err) => {
      return res.status(200).json(createCustomResponse("err", `no existe`));
    });
};

//  ******************** Cuentas ********************

const ctaCrearItem = (req, res) => {
  //console.log("item",req.body);
  let itemNuevo = new proveedorCta(req.body);
  itemNuevo
    .save()
    .then((result) => {
      return res.status(200).json(createCustomResponse("ok", result));
    })
    .catch((err) => {
      return res.status(400).json(createCustomResponse("err", `ya existe`));
    });
  
};

const ctaBorrarProveedor = (req, res) => {
  
  proveedorCta
    .deleteMany({ proveedor: req.params.proveedor })
    .then((result) => {
      return res
        .status(200)
        .json(createCustomResponse("ok", `cuenta proveedor borrada`));
    })
    .catch((err) => {
      return res
        .status(400)
        .json(createCustomResponse("err", `proveedor inexistente`));
    });
};

const ctaGetByProveedor = (req, res) => {
  proveedorCta
    .find(
      { proveedor: req.params.proveedor },
      { __v: 0 },
      { sort: { _id: -1 } }
    ) 
    .populate("proveedor", ["nombre", "saldo"])
    .then((result) => {
      return res.status(200).json(createCustomResponse("ok", result));
    })
    .catch((err) => {
      return res
        .status(200)
        .json(createCustomResponse("error", "hubo un error"));
    });
};

module.exports = {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  ctaCrearItem,
  ctaBorrarProveedor,
  ctaGetByProveedor,
};
