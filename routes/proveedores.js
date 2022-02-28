const router = require('express').Router()
 
 const {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  ctaCrearItem,
  ctaBorrarProveedor,
  ctaGetByProveedor
  
} = require('../controllers/proveedoresController')


 router.get('/', getProveedores)
 router.get('/:id',getProveedorById)
 router.post('/', createProveedor)
 router.patch('/:proveedor', updateProveedor)
 router.delete('/:proveedor', deleteProveedor)
 router.post('/cuentas', ctaCrearItem)
 router.get('/cuentas/:proveedor', ctaGetByProveedor)
 router.delete('/cuentas/:proveedor', ctaBorrarProveedor)

 
 module.exports = router