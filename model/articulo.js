var mongoose = require('mongoose');


const articuloSchema = new mongoose.Schema({
   id:{type:String,required:true,unique:true},
   descripcion:{type:String,required:true},
   rubro:{type: mongoose.Schema.Types.ObjectId,ref:'Rubro',required:true},
   valor:{type: Number,default:0 },
   cantidad:{type: Number, default:0,integer:true},
   precio1:{type: Number,default:0 },
   condicion1:{type: String},
   precio2:{type: Number,default:0 },
   condicion2:{type: String},
   precio3:{type: Number,default:0 },
   condicion3:{type: String},
   proveedor:{type: mongoose.Schema.Types.ObjectId,ref:'Proveedor',required:true},
   stock:{type: Number,
   default:0,integer:true},
});



module.exports = mongoose.model('articulo', articuloSchema);