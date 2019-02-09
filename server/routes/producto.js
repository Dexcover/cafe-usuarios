const express=require('express');

const {verificaToken}= require('../middlewares/autenticacion');

let app=express();

let Producto = require('../models/producto');

/** Obtener productos
 * populate usuario categoria
 * paginado
*/
app.get('/productos', verificaToken, (req, res)=>{
let desde = req.query.desde || 0;
desde = Number(desde);
Producto.find({disponible:true})
.skip(desde)
.limit(5)
.populate('usuario', 'nombre email')
.populate('categoria', 'descripcion')
.exec((err, productosDB)=>{
    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    res.json({
        ok: true,
        productos:productosDB
    });
});
});

app.get('/productos/:id', verificaToken, (req, res)=>{
    let id= req.params.id;

    Producto.findById(id, {disponible:true})
    .populate('usuario', 'nombre email')
.populate('categoria', 'descripcion')
    .exec((err, productoDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
    
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto:productoDB
        });

    });
});


/**Buscar productos */

app.get('/productos/buscar/:termino', verificaToken, (req, res)=>{

    let termino = req.params.termino;

    let regex= new RegExp(termino, 'i');

    Producto.find({nombre:regex})
    .populate('categoria', 'descripcion')
    .exec((err, productos)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
    
        res.json({
            ok: true,
            productos
        });
    });

});


app.post('/productos', verificaToken,(req, res)=>{
let body = req.body;
let producto = new Producto({
    usuario: req.usuario._id,
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    dispoonible: body.dispoonible,
    categoria: body.categoria
});

producto.save((err, productoDB)=>{

    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    res.status(201).json({
        ok: true,
        producto:productoDB
    });

});
});


app.put('/productos/:id', verificaToken,(req, res)=>{
let id= req.params.id;
let body=req.body;
Producto.findById(id,(err, productoDB)=>{
    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    if (!productoDB) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El id no encontrado'
            }
        });
    }
    productoDB.nombre= body.nombre;
    productoDB.precioUni= body.precioUni;
    productoDB.descripcion= body.descripcion;
    productoDB.dispoonible= body.dispoonible;
    productoDB.categoria= body.categoria;

    productoDB.save((err, productoDB)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
    
        res.status(201).json({
            ok: true,
            producto:productoDB
        });
    
    });


});
});

app.delete('/productos/:id', verificaToken,(req, res)=>{
    let id= req.params.id;

    Producto.findById(id, (err, productoDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
    
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no encontrado'
                }
            });
        }

        productoDB.disponible=false;

        productoDB.save((err, productoBorrado)=>{

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto Borrado'
            });

        });

    });
});


/** Obtener un producto por ID
 * populate usuario categoria
 * paginado
*/


/**Crear un producto
 * grabar el suauri
 * grabar una categoria del listado
 */

 /**
  * Actualizar un nuevo producto
  */


 /**
  * Borrar un nuevo producto
  */







module.exports=app;