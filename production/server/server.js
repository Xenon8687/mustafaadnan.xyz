const express =  require('express');
const path =  require('path');
const { Server } =  require('socket.io');
const io =  require('socket.io');
const http =  require('http');
const bodyParser =  require('body-parser');
const cookieParser =  require('cookie-parser');
const indexRouter =  require("./routes/index");
const authorRouter =  require("./routes/author");

var app = express();
var server = http.createServer(app);
var socket = new Server(server);

app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '..', 'public')))

async function emitStatus(data) {
  socket.to('sockets').emit('status', (await (await global.discord).getStatus()).presence);
}

app.use("/api/v1/author", authorRouter);
app.use("/*", indexRouter);

server.listen(3000, async () => {
  global.discord = require('../discord/main')(emitStatus);
});

var total = 0;

socket.on("connection", async socket => {
  socket.join('sockets');
  socket.emit('status', (await (await global.discord).getStatus()).presence);
  socket.on("disconnect", () => {
    total--;
  });
});