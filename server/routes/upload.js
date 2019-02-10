const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')
// default options
app.use(fileUpload())

app.put('/upload/:tipo/:id', function (req, res) {
  let tipo = req.params.tipo
  let id = req.params.id

  if (Object.keys(req.files).length == 0) {
    return res.status(400)
      .json({
        ok: false,
        err: {
          message: 'No archivos subidos'
        }
      })
  }

  // valido tipo

  let tiposValidos = ['productos', 'usuarios']

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(500).json({
      ok: false,
      err: {
        message: 'Los tipos validos son: ' + tiposValidos.join(', '),
        ext: tipo
    }})
  }

  let archivo = req.files.archivo
  let nombreCortado = archivo.name.split('.')
  let extension = nombreCortado[nombreCortado.length - 1]

  // Extensiones permitidas

  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(500).json({
      ok: false,
      err: {
        message: 'Extensiones validas son: ' + extensionesValidas.join(', '),
        ext: extension
    }})
  }
  // Cambiar nombre del archivo
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

  archivo.mv(`uploads/${tipo}/${ nombreArchivo}`, (err) => {
    if (err)
      return res.status(500).json({
        ok: false,
      err})
    if (tipo === 'usuarios') {
      imagenUsuario(id, res, nombreArchivo)
    }else {
      imagenProducto(id, res, nombreArchivo)
    }
  })
})

function imagenUsuario (id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, 'usuarios')
      return res.status(500).json({
        ok: false,
      err})
    }

    if (!usuarioDB) {
      borrarArchivo(nombreArchivo, 'usuarios')
      return res.json({
        ok: false,
        err: {
          message: 'El usuario no existe'
        }
      })
    }

    borrarArchivo(usuarioDB.img, 'usuarios')

    usuarioDB.img = nombreArchivo
    usuarioDB.save((err, usuarioDB) => {
      res.json({
        ok: true,
        Usuario: usuarioDB,
        img: nombreArchivo
      })
    })
  })
}

function imagenProducto (id, res, nombreArchivo) {
  Producto.findById(id, (err, productoBD) => {
    if (err) {
      borrarArchivo(nombreArchivo, 'productos')
      return res.status(500).json({
        ok: false,
      err})
    }

    if (!productoBD) {
      borrarArchivo(nombreArchivo, 'productos')
      return res.json({
        ok: false,
        err: {
          message: 'El producto no existe'
        }
      })
    }

    borrarArchivo(productoBD.img, 'productos')

    productoBD.img = nombreArchivo
    productoBD.save((err, productoBD) => {
      res.json({
        ok: true,
        producto: productoBD,
        img: nombreArchivo
      })
    })
  })
}

function borrarArchivo (nombreImagen, tipo) {
  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen)
  }
}
module.exports = app
