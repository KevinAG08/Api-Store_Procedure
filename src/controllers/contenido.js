const { request, response } = require('express')
const connection = require('../conexion')

const getContenidos = (req = request, res = response) => {

    const knex = require('knex')(connection)

    knex
        .select('*')
        .from('tblContenido')
        .then(contenidos => {
            return res.status(200).json(contenidos)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                ok: false,
                msg: 'Por Favor hable con el administrador'
            })
        })
        .finally(() => {
            knex.destroy();
        })
}

const getContenido = (req = request, res = response) => {

    const knex = require('knex')(connection)

    const IdContenido = req.params.IdContenido

    knex
        .select('*')
        .from('tblContenido')
        .where('IdContenido', IdContenido)
        .then(([contenido]) => {
            return res.status(200).json(contenido)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                ok: false,
                msg: 'Por Favor hable con el administrador'
            })
        })
        .finally(() => {
            knex.destroy();
        })
}

const getContenidosExperiencia = (req = request, res = response) => {

    const knex = require('knex')(connection)

    const IdExperiencia = req.params.IdExperiencia

    knex
        .raw('CALL get_contenidos_experiencia(?)', [IdExperiencia])
        .then(([[contenidos]]) => {
            return res.status(200).json(contenidos)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                ok: false,
                msg: 'Por Favor hable con el administrador'
            })
        })
        .finally(() => {
            knex.destroy();
        })
}

const postContenido = (req = request, res = response) => {

    const knex = require('knex')(connection)

    const nuevoContenido = [
        req.body.CoTitulo,
        req.body.CoDescripcion,
        req.body.CoUrlMedia,
        req.body.IdTipoMedia,
        req.body.IdExperiencia
    ]

    knex
        .raw('CALL post_contenido(?,?,?,?,?)', nuevoContenido)
        .then(_ => {
            return res.status(201).json({
                ok: true,
                msg: `Se creo el contenido`
            })
        })
        .catch((error) => {
            console.log(error)
            res.status(400).json({
                ok: false,
                msg: 'No se pudo crear el contenido, Media o Experiencia no existe'
            })
        })
        .finally(() => {
            knex.destroy();
        })
}

const putContenido = (req = request, res = response) => {

    const knex = require('knex')(connection)

    const IdContenido = req.params.IdContenido
    const editarContenido = [
        IdContenido,
        req.body.CoTitulo,
        req.body.CoDescripcion,
        req.body.CoUrlMedia,
        req.body.IdTipoMedia,
    ]

    knex
        .raw('CALL put_contenido(?,?,?,?,?)', editarContenido)
        .then(([[r]]) => {
            if (r.length) {
                return res.status(200).json({
                    ok: true,
                    msg: `Contenido ${IdContenido} editado`
                })

            }
            return res.status(404).json({
                ok: false,
                msg: `Contenido ${IdContenido} no existe`
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                ok: false,
                msg: 'Por Favor hable con el administrador'
            })
        })
        .finally(() => {
            knex.destroy();
        })
}

const deleteContenido = async (req = request, res = response) => {

    const knex = require('knex')(connection)

    const IdContenido = req.params.IdContenido

    await knex('tblContenido')
        .where("IdContenido", IdContenido)
        .del()
        .then(contenido => {
            if (!contenido) {
                return res.status(404).json({
                    ok: false,
                    msg: `Contenido ${IdContenido} no existe`
                })
            }

            return res.status(200).json({
                ok: true,
                msg: `Contenido ${IdContenido} eliminado`
            })
        })
        .catch(error => {
            console.log(error)
            res.status(400).json({
                ok: false,
                msg: 'Por Favor hable con el administrador'
            })
        })
        .finally(() => {
            knex.destroy();
        })
}

module.exports = {
    getContenidos,
    getContenido,
    getContenidosExperiencia,
    postContenido,
    putContenido,
    deleteContenido
}
