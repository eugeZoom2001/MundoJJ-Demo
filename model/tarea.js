const {Schema,model}= require('mongoose');
const {fechafechaIsoPorDefecto}=require('../utils/constantes')
const tareaSchema = new Schema({
   patente: {type: String,required: true},
   tarea: {type: String,required:true},
   fecha:{type: Date, default: Date.now} 
});

module.exports = new model('Tarea', tareaSchema);