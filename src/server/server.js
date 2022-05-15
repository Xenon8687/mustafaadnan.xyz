const express =  require('express');
const mysql =  require('mysql2/promise');
const util =  require('util');
const path =  require('path');
const { Server } =  require('socket.io');
const http =  require('http');
const session =  require('cookie-session');
const bodyParser =  require('body-parser');
const cookieParser =  require('cookie-parser');
const indexRouter =  require("./routes/index");
const authorRouter =  require("./routes/author");
const blogRouter =  require('./routes/blog');
const config =  require('../config.json');

module.exports = async function() {
var app = express();
var server = http.createServer(app);
var socket = new Server(server);

app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  name: 'session',
  keys: [config.discord.token, config.mysql.password],
  maxAge: 30 * 24 * 60 * 60 * 1000
}))|


app.use(express.static(path.join(__dirname, '..', 'public')))

let conn = await mysql.createConnection(config.mysql);

await conn.execute(`CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      content TEXT NOT NULL,
      banner TEXT NOT NULL,
      tags TEXT NOT NULL,
      short_url TEXT NOT NULL,
      views INT NOT NULL,
      author TEXT NOT NULL
) CHARACTER SET utf8 COLLATE utf8_general_ci`);
console.log('sa');
async function emitStatus(data) {
  socket.to('sockets').emit('status', (await (await global.discord).getStatus()).presence);
}
process.on('SIGINT', function() {
  conn.end(function (err) {
    process.exit(0);
  });
});
app.use("/api/v1/author", authorRouter);
app.use("/api/v1/blog", blogRouter(conn));
app.use("/*", indexRouter);

server.listen(80, async () => {
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
setTimeout(function() {
  process.exit();
}, 86400000);
}