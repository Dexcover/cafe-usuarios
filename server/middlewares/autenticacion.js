const jwt = require('jsonwebtoken')

// ===============
// Verificar token
// ===============

let verificaToken = (req, res, next) => {


  let token = req.get('token') // Authorization

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    /*Error*/
    if (err) {
      return res.status(401).json({
        ok: false,
      err})
    }

    req.usuario = decoded.usuario
    next()
  })
}

// ===================
// Verifica AdminRole
// ===================

let verificaAdminRole = (req, res, next) => {

  let usuario = req.usuario

  if (usuario.role === 'ADMIN_ROLE') {
    next()
  }else {
    return res.status(401).json({
      ok: false,
      err: {
        message: 'El usuario no es administrador'
      }
    })
  }
}

// ===================
// Verifica Token img
// ===================

let verificaTokenImg = (req, res, next) => {
  let token = req.query.token

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    /*Error*/
    if (err) {
      return res.status(401).json({
        ok: false,
      err})
    }

    req.usuario = decoded.usuario
    next()
  })
}

module.exports = {
  verificaToken,
  verificaAdminRole,
verificaTokenImg}
