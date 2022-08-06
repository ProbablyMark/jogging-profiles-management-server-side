//Error MW
exports.errorMiddleWare = (error, req, res, next) => {
  try {
    let status = error.status || 500
    res.status(status).json({ Error: `${error}` })
  } catch (error) {
    next(error)
  }
}
