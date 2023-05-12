const { request, response } = require('express')
const connection = require('../conexion')

const getExperiencias = (req = request, res = response) => {

    const knex = require('knex')(connection)

    knex
        .select('*')
        .from("tblExperiencia")
        .then(experiencias => {
            return res.status(200).json(experiencias)
        })
        .catch(error => {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: "Por Favor hable con el administrador"
            })
        })
        .finally(() => {
            knex.destroy();
        })
}

const getExperiencia = async (req = request, res = response) => {

    const knex = require('knex')(connection)

    const IdExperiencia = req.params.id

    await knex
        .select("*")
        .from("tblExperiencia")
        .where('IdExperiencia', IdExperiencia)
        .then(([experiencia]) => {
            return res.status(200).json(experiencia)
        })
        .catch(error => {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: "Por Favor hable con el administrador"
            })
        })
        .finally(() => {
            knex.destroy();
        })
}

const getExperienciasCarrera = (req = request, res = response) => {

    const knex = require('knex')(connection)

    const IdCarrera = req.params.IdCarrera

    knex
        .raw('CALL get_experiencias_carrera(?)', [IdCarrera])
        .then(([[experiencias]]) => {
            return res.status(200).json(experiencias)
        })
        .catch(error => {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: "Por Favor hable con el administrador"
            })
        })
        .finally(() => {
            knex.destroy();
        })
}

const postExperiencia = async (req = request, res = response) => {

    const knex = require('knex')(connection)

    const nuevaExperiencia = [
        req.body.ExNombre,
        req.body.ExCicloInicio,
        req.body.ExCicloFin,
        req.body.ExFila,
        req.body.ExIconoUrl,
        req.body.IdCarrera,
    ]

    knex
        .raw('CALL post_experiencia(?,?,?,?,?,?,@ex_id)', nuevaExperiencia)
        .then(() => {
            return knex.select(knex.raw('@ex_id'))
        })
        .then(([result]) => {
            const id = result['@ex_id'];
            return res.status(201).json({
                ok: true,
                msg: `Experiencia creada exitosamente`,
                id
            });
        })
        .catch((error) => {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: "Por Favor hable con el administrador"
            })
        })
        .finally(() => {
            knex.destroy();
        })

}

const putExperiencia = (req = request, res = response) => {

    const knex = require('knex')(connection)

    const IdExperiencia = req.params.id

    const nuevaExperiencia = [
        IdExperiencia,
        req.body.ExNombre,
        req.body.ExCicloInicio,
        req.body.ExCicloFin,
        req.body.ExFila,
        req.body.ExIconoUrl,
    ]

    knex
        .raw('CALL put_experiencia(?,?,?,?,?,?)', nuevaExperiencia)
        .then(([[r]]) => {
            if (r.length) {
                return res.status(200).json({
                    ok: true,
                    msg: `Experiencia ${IdExperiencia} editada`,
                })
            }
            return res.status(404).json({
                ok: false,
                msg: `No existe la experiencia ${IdExperiencia}`,
            })

        })
        .catch(error => {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: "Por Favor hable con el administrador"
            })
        })
        .finally(() => {
            knex.destroy();
        })
}

const deleteExperiencia = async (req = request, res = response) => {

    const knex = require('knex')(connection)

    const IdExperiencia = req.params.id

    await knex('tblExperiencia')
        .where("IdExperiencia", IdExperiencia)
        .del()
        .then((experiencia) => {
            if (!experiencia) {
                return res.status(404).json({
                    ok: false,
                    msg: `Experiencia ${IdExperiencia} no existe`
                })
            }

            return res.status(200).json({
                ok: true,
                msg: `Experiencia ${IdExperiencia} eliminado`
            })
        })
        .catch(error => {
            console.log(error)
            return res.status(500).json({
                ok: false,
                msg: "Por Favor hable con el administrador"
            })
        })
        .finally(() => {
            knex.destroy();
        })
}

module.exports = {
    getExperiencias,
    getExperiencia,
    getExperienciasCarrera,
    postExperiencia,
    putExperiencia,
    deleteExperiencia
}
