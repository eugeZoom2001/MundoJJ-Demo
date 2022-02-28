var mongoose = require('mongoose');
let {DateTime}=require('luxon')

const proveedorCtaSchema = new mongoose.Schema({
   proveedor:{type: mongoose.Schema.Types.ObjectId,ref:'Proveedor',required:true},
   comprobante:{type: String},
   operacion:{type: String,required:true},
   obvs:{type: String},
   importe:{type: Number,default:0,required:true },
   saldo:{type: Number,default:0 },
   fecha:{type: Date,default:DateTime.now()}
   
});



module.exports = mongoose.model('ctaProveedor', proveedorCtaSchema);