const { Router } = require('express')
const { getExperiencia, getExperiencias, postExperiencia, putExperiencia, deleteExperiencia, getExperienciasCarrera } = require('../controllers/experiencia')

const router = Router()

router.get('/', getExperiencias)

router.get('/:id', getExperiencia)

router.get('/carrera/:IdCarrera', getExperienciasCarrera)

router.post('/', postExperiencia)

router.put('/:id', putExperiencia)

router.delete('/:id', deleteExperiencia)

module.exports = router