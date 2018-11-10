const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
require('./models/user.model')
// Passport has to be the below models and before routes
require('./config/passport')
const server = require('http').Server(app)
const io = require('socket.io')(server)
// Require API routes
const users = require('./routes/api/users')
const group = require('./routes/api/group.route')
const member = require('./routes/api/member.route')
const poll = require('./routes/api/poll.route')
const entry = require('./routes/api/entry.route')

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const mongoDB =
  process.env.MONGODB_URI ||
  'mongodb://admin:admin0@ds145053.mlab.com:45053/helhadoodledb'
const mongoDBOptions = {
  useNewUrlParser: true,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  keepAlive: true,
  keepAliveInitialDelay: 30000
}
const store = new MongoDBStore({
  uri: mongoDB,
  collection: 'mySessions'
})

app.set('port', port)

server.listen(8000)

/* --- MONGODB --- */
// Set up mongoose connection
mongoose.connect(
  mongoDB,
  mongoDBOptions
)
store.on('connected', function() {
  store.client // The underlying MongoClient object from the MongoDB driver
})
// Catch errors
store.on('error', function(error) {
  assert.ifError(error)
  assert.ok(false)
})
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
/* --- MONGODB --- */

/* --- MIDDLEWARE REGISTRATIONS --- */
app.use(cors({ origin: true, credentials: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// API Routes
app.use('/api/users', users)
app.use('/api/polls', poll)
app.use('/api/entries', entry)
app.use('/api/groups', group)
app.use('/api/members', member)
app.use(
  session({
    secret: 'helhadoodlesecretauth',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true
  })
)
/* --- MIDDLEWARE REGISTRATIONS --- */

/* --- SOCKET IO --- */
const connectedUsers = []

var onConnect = socket => {
  // On login, store the userId on socket object
  socket.on('user_logged', userId => {
    connectedUsers.push({ userId: userId, socketId: socket.id })
  })
  socket.on('remove_users_from_group', function(data) {
    if (data && data.removedUsers) {
      connectedUsers.forEach(user => {
        if (data.removedUsers.includes(user.userId)) {
          io.to(`${user.socketId}`).emit('removed_from_group', data.group)
          console.log(`removed_from_group sent to ${user.userId}`)
        }
      })
    }
  })
  socket.on('add_users_from_group', function(data) {
    if (data && data.addedUsers) {
      connectedUsers.forEach(user => {
        if (data.addedUsers.includes(user.userId)) {
          io.to(`${user.socketId}`).emit('added_to_group', data.group)
          console.log(`added_to_group sent to ${user.userId}`)
        }
      })
    }
  })
}

io.on('connect', onConnect)
/* --- SOCKET IO --- */

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

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
