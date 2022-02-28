const {Schema,model}= require('mongoose');


  const rubroSchema = new Schema({
    nombre: {
      type: String,
      unique: true,
      required:true 
    }
  });
  module.exports = new model('Rubro', rubroSchema);