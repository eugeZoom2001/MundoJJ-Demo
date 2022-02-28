const {Schema,model}= require('mongoose');
const fechaPorDefecto=require('../utils/constantes').fechaPorDefecto
const autoSchema = new Schema({
   patente: {type: String,unique: true,required: true},
   nombre: {type: String,required:true },
   telefono:{type: String,required:true },
   mail:{type: String,required:true },
   marca:{type: String,required:true },
   km:{type: String,default:0},
   vencimiento1: {type: Date,default:fechaPorDefecto},
   vencimiento2: {type: Date,default:fechaPorDefecto}
});


module.exports = new model('Auto', autoSchema);