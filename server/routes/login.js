const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario= require('../models/usuario')
const app = express()

app.post('/login', (req,res)=>{
    let body= req.body;

    Usuario.findOne({email:body.email}, (err, usuarioBD)=>{
        
        /*Error*/
        if(err){
            return res.status(400).json({
              ok: false,
              err
            });
          }

        if(!usuarioBD){
            return res.status(400).json({
                ok: false,
                err:{
                    message: '(Usuario) o contraseña incorrectos.'
                }
              });
        }

        if(!bcrypt.compareSync(body.password, usuarioBD.password)){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario o (contraseña) incorrectos.'
                }
              });
        }

        let token = jwt.sign(
            { usuario: usuarioBD},process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok:true,
            usuario:usuarioBD,
            token
        });

    });
});

//Configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }

app.post('/google', async (req,res)=>{
    let token = req.body.idtoken;

    let googleUser =await verify(token)
                            .catch(e=>{
                                return res.status(403).json({
                                    ok:false,
                                    err: e
                                });
                            });
    Usuario.findOne({
        email: googleUser.email
    }, (err, usuarioBD)=>{
         /*Error*/
         if(err){
            return res.status(500).json({
              ok: false,
              err
            });
          }

          if(usuarioBD){
              if(usuarioBD.google===false){
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'Debe usar su autenticación normal'
                    }
                  });
              }else{
                let token = jwt.sign(
                    { usuario: usuarioBD},process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});
                
                res.json({
                    ok: true,
                    usuario:usuarioBD,
                    token
                });
              }

          }else{
              //Si el usuario no existe en nuestra base de datos
              let usuario = new Usuario();
              usuario.nombre = googleUser.nombre;
              usuario.email = googleUser.email;
              usuario.img = googleUser.password;
              usuario.google = true;
              usuario.password=':)';

              usuario.save((err, usuarioBD)=>{
                  /*Error*/
                    if(err){
                        return res.status(500).json({
                        ok: false,
                        err
                        });
                    }

                    let token = jwt.sign(
                        { usuario: usuarioBD},process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});
                    
                     res.json({
                        ok: true,
                        usuario:usuarioBD,
                        token
                    });
              });

          }



    });
});
module.exports= app;