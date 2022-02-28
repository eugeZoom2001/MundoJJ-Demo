const { createCustomResponse } = require("./responseObject");
const { fechaPorDefecto } = require("../utils/constantes");
const auto = require("../model/auto");
const tarea = require("../model/tarea");

// GET
const getAutos = async (req, res) => {
  try {
    const autos = await auto.find();
    return res.status(200).json(createCustomResponse("ok", autos));
  } catch (error) {
    return res
      .status(500)
      .json(createCustomResponse("err", { data: "hubo un error" }));
  }
};

// POST
const createAuto = async (req, res, next) => {
  const data = req.body;
  // console.log(data);
  try {
    let movilNuevo = new auto(req.body);
    if (!movilNuevo.vencimiento1) {
      movilNuevo.vencimiento1 = fechaPorDefecto;
    }
    if (!movilNuevo.vencimiento2) {
      movilNuevo.vencimiento2 = fechaPorDefecto;
    }

    tareaNueva = req.body.tarea;
    respuestaApi = {};
    movilNuevo
      .save()
      .then(() => {
        const hayTarea = tareaNueva && tareaNueva.length > 0;
        if (hayTarea > 0) {
          let nuevaTarea = new tarea(req.body);
          nuevaTarea
            .save()
            .then((result) => {})
            .catch((err) => {
              return res
                .status(500)
                .json(createCustomResponse("err", "error tarea"));
            });
        }
        return res.status(201).json(createCustomResponse("ok", "auto creado"));
      })
      .catch((err) => {
        return res
          .status(200)
          .json(createCustomResponse("err", "El auto Existe"));
      });
  } catch (error) {
    return res.status(500).json(createCustomResponse("err", "hubo un error"));
  }
  
};

//GET BY ID
const getAuto = async (req, res) => {
  const patente = req.params.patente;
  //console.log(req.params);
  try {
    const autoFind = await auto.find({ patente: patente });
    if (autoFind.length > 0) {
      return res.status(200).json(createCustomResponse("ok", autoFind));
    } else {
      return res
        .status(404)
        .json(createCustomResponse("err", `auto no encontrado ${patente}`));
    }
  } catch (error) {
    return res.status(500).json(createCustomResponse("err", `error`));
  }
  
};

//PATCH
const updateAuto = async (req, res) => {
  let patenteAnt = req.params.patente;
  let tareaNueva = req.body.tarea;

  let patente = req.body.patente;
  if (!patente) {
    patente = patenteAnt;
  }
  if (!tareaNueva) {
    tareaNueva = "";
  }
  
  let respU = await auto
    .findOneAndUpdate({ patente: patenteAnt }, req.body)
    .catch((err) => {
  
    });
  
  if (!respU) {
    res
      .status(404)
      .json(createCustomResponse("err", `auto no encontrado ${patenteAnt}`));
  } else {
    if (patente != patenteAnt) {
      await tarea.updateMany({ patente: patenteAnt }, { patente: patente });
    }
    if (tareaNueva.length > 0) {
      nuevaTarea2 = new tarea({ patente: patente, tarea: tareaNueva });
      await nuevaTarea2.save();
    }

    let respuesta = { result: "ok" };
    return res.status(200).json(createCustomResponse("ok", respuesta));
  }
};

//DELETE
const deleteAuto = async (req, res) => {
  const patente = req.params.patente;
  try {
    auto
      .deleteOne({ patente: patente })
      .then((result) => {
        // console.log("result borrado auto" ,result);
        tarea
          .deleteMany({ patente: patente })
          .then((result) => {
            return res
              .status(200)
              .json(createCustomResponse("ok", `auto borrado ${patente}`));
          })
          .catch((err) => {
            return res
              .status(404)
              .json(
                createCustomResponse("err", `auto no encontrado ${patente}`)
              );
          });
      })
      .catch((err) => {
        return res
          .status(404)
          .json(createCustomResponse("err", `auto no encontrado ${patente}`));
      });
  } catch (error) {
    return res.status(500).json(createCustomResponse("err", `error servidor`));
  }
};

const getTareasMovil = (req, res) => {
  const patente = req.params.patente;
    tarea
    .find({ patente: patente })
    .then((result) => {
      return res.status(200).json(createCustomResponse("ok", result));
    })
    .catch((err) => {
      return res.status(404).json(createCustomResponse("err", `Hubo un Error`));
    });
};

module.exports = {
  getAutos,
  createAuto,
  getAuto,
  updateAuto,
  deleteAuto,
  getTareasMovil,
};
