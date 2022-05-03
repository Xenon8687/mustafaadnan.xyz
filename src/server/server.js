import express from 'express';
import mysql from 'mysql2/promise';
import util from 'util';
import path from 'path';
import io, { Server } from 'socket.io';
import http from 'http';
import session from 'cookie-session';  
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import indexRouter from "./routes/index";
import authorRouter from "./routes/author";
import blogRouter from './routes/blog';
import config from '../config.json';

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
}