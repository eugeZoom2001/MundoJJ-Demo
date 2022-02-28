const {Schema,model}= require('mongoose');

const proveedorSchema = new Schema({
   nombre: {type: String,required:true,unique:true},
   telefonos:{type: String},
   mail:{type: String },
   direccion:{type: String},
   contacto:{type: String},
   saldo:{type:Number,default:0}

});


module.exports = new model('Proveedor', proveedorSchema);