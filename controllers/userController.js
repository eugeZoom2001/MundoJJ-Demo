const User = require("../model/user");
const { createCustomResponse } = require("./responseObject");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    res
      .status(StatusCodes.CREATED)
      .json({ usuario: { nombre: user.nombre, id: user._id } });
  } catch (error) {
    throw new BadRequestError("Datos Incorrectos");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Por Favor Ingrese Email y Password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Credenciales Invalidas");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Credenciales Invalidas");
  }
  // comparo passwords
  const token = user.createJWT();
 
  return res.status(200).json(
    createCustomResponse("ok", {
      user: user.nombre,
      id: user._id,
      token: token,
    })
  );
};

module.exports = {
  register,
  login,
};
