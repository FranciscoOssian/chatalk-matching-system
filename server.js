const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  maxHttpBufferSize: 1e8
});

const usersBucket = []

const port = process.env.PORT || 8000

//used only to run the site ---------------------------
app.use( express.static( path.join( __dirname, 'public' ) ) )
app.set( 'views', path.join( __dirname, 'public' ) )
app.engine( 'html', require('ejs').renderFile )
app.set( 'view engine', 'html' )
app.use('/', (req, res) => {
  res.render('empty.html')
})
//-------------------------------------------------------------


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  console.log('a user connected');

  socket.once('add_user', (user) => {

    usersBucket.push(
      {
        socketID: socket.id,
        user: user
      }
    )

    if (usersBucket.length >= 2) {
      user_one = usersBucket.pop()
      user_two = usersBucket.pop()

      io.to(user_one.socketID).emit('match', user_two);
      io.to(user_two.socketID).emit('match', user_one);
    }

  })

  socket.on("disconnect", (reason) => {

    let index;
    for(let i = 0; i < usersBucket.length; ++i){
      if(usersBucket[i].socketID === socket.id)
        index = i
    }

    if( index < 0 ) return

    usersBucket.splice(index, 1);
  })

});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
