const router = require('express').Router()
 
 const {
  getRubros,
  createRubro,
  getRubroById,
  createArticulo,
  getArticulos,
  updateArticulo,
  deleteArticulo
  
} = require('../controllers/stockController')

 router.get('/rubros', getRubros)
 router.get('/rubros/:id',getRubroById)
 router.post('/rubros', createRubro)
 router.post('/articulos', createArticulo)
 router.get('/articulos', getArticulos)
 router.patch('/articulos/:articulo',updateArticulo)
 router.delete('/articulos/:articulo',deleteArticulo)


 
  
 

 
 module.exports = router
