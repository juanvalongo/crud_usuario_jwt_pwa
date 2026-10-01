function adminMiddleware(req, res, next) {
  if (req.user.tipo !== 'admin') {
    return res.status(403).json({ mensagem: 'Acesso negado' })
  }

  next()
}

module.exports = adminMiddleware
