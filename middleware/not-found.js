const notFound = (req, res) => {
  //console.log("error not found");
  res.status(404).send("el recurso no existe");
};
module.exports = notFound;
