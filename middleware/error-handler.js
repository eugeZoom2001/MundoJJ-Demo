const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
 
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Algo salio mal , intentelo nuevamente !!',
  }

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customError.statusCode = 400
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Valor Duplicador ${Object.keys(
      err.keyValue
    )} Por Favor Elija Otro Valor`
    customError.statusCode = 400
  }
  if (err.name === 'CastError') {
    customError.msg = `id : ${err.value} no encontrado`
    customError.statusCode = 404
  }
  
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
