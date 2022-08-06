const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  let token, decode
  try {
    token = req.get('Authorization').split(' ')[1]
    decode = jwt.verify(token, process.env.ACCESS_SECRET_KEY)
    if (
      (decode.role === 'lvl1' && decode._id != req.params.userId) ||
      (decode.role === 'lvl2' && req.method != 'GET')
    ) {
      next(new Error('not authorized'))
    }
  } catch (error) {
    error.message = 'Not Authorized please login'
    error.status = 403
    next(error)
  }
  if (decode !== undefined) {
    req.role = token.role
    next()
  }
}
