const path = require('path')
const express = require('express')
const webpack = require('webpack')

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config')

const
  app = express(),
  DIST_DIR = path.join(__dirname, 'dist'),
  PORT = 9000,
  compiler = webpack(webpackConfig)

let devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

let hotMiddleware = webpackHotMiddleware(compiler, {
  log: false,
  heartbeat: 1000
})

app.use(devMiddleware)
app.use(hotMiddleware)
app.use(express.static(DIST_DIR))
app.listen(PORT, function () {
  console.log('Server on, localhost:' + PORT)
})
