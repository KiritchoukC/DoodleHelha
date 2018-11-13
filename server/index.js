const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
// const http = require('http')
// const server = http.createServer(app)
// const io = require('socket.io')(server)
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

// server.listen(1234)

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  app.listen(port, host)

  // Listen the server
  // const server = app.listen(port, host)
  // const io = SocketIO(server)

  // /* --- SOCKET IO --- */
  // const connectedUsers = []

  // var onConnect = socket => {
  //   console.log('connected')
  //   // On login, store the userId on socket object
  //   socket.on('user_logged', userId => {
  //     connectedUsers.push({ userId: userId, socketId: socket.id })
  //   })
  //   socket.on('remove_users_from_group', function(data) {
  //     if (data && data.removedUsers) {
  //       connectedUsers.forEach(user => {
  //         if (data.removedUsers.includes(user.userId)) {
  //           io.to(`${user.socketId}`).emit('removed_from_group', data.group)
  //         }
  //       })
  //     }
  //   })
  //   socket.on('add_users_from_group', function(data) {
  //     if (data && data.addedUsers) {
  //       connectedUsers.forEach(user => {
  //         if (data.addedUsers.includes(user.userId)) {
  //           io.to(`${user.socketId}`).emit('added_to_group', data.group)
  //         }
  //       })
  //     }
  //   })
  // }
  // io.on('connect', onConnect)
  /* --- SOCKET IO --- */

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
