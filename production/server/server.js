import express from 'express';
import path from 'path';
import io, { Server } from 'socket.io';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import indexRouter from "./routes/index";
import authorRouter from "./routes/author";

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