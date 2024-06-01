import express from "express";
const app = express();
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
app.use(bodyParser.json());

import Lamp from "./controllers/Lamp";
import Connection from "./controllers/Connection";
import initializeDb from "./db/initializeDb";

import type SocketData from "./types/SocketData";

import config from "../config";
const PORT = config.PORT;

app.use(cors());

initializeDb().then(() => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    allowEIO3: true,
  });

  app.get("/verify", async (req, res) => {
    const lampCode = req.query?.lampCode as string;
    if (!lampCode) {
      return res.json({ exists: false, isConnected: false });
    }

    const exists = await Lamp.exists(lampCode);
    const isConnected = await Lamp.isConnected(lampCode);

    res.json({ exists, isConnected });
  });

  io.on("connection", (socket) => {
    //lamp connection
    socket.on("generateLampCode", async () => {
      const lampCode = await Lamp.create();
      io.to(socket.id).emit("generateLampCode", { lampCode });
    });

    //connect new lamp
    socket.on("addconnection", async (lampCode: string) => {
      let isDevice = false;
      if (lampCode.length == 37) {
        //the connection is from device
        lampCode = lampCode.slice(0, 36);
        isDevice = true;

        const sockets = await Connection.getByCode(lampCode);
        for (const socketId of sockets) {
          io.to(socketId).emit("addconnection", true);
        }
      }

      await Connection.add(socket.id, lampCode, isDevice);

      const lampState = await Lamp.getState(lampCode);
      if (!lampState) {
        socket.disconnect();
        return;
      }

      ["brightness", "temperature", "motion", "angle", "power"].forEach(
        (event) => io.to(socket.id).emit(event, lampState[event])
      );

      io.to(socket.id).emit("addconnection", await Lamp.isConnected(lampCode));
    });

    //send infos
    ["brightness", "temperature", "motion", "angle", "power"].forEach(
      (event) => {
        socket.on(event, async (value: string) => {
          const lampCode = await Connection.getLampCode(socket.id);
          // SET STATE
          await Lamp.set(lampCode, event, +value);
          // INFORM ALL CLIENTS
          const sockets = await Connection.getByCode(lampCode);
          sockets.forEach((socketId) => {
            if (socketId !== socket.id) io.to(socketId).emit(event, value);
          });
        });
      }
    );

    socket.on("disconnect", async (reason) => {
      //if device disconnects, inform all clients
      if (await Connection.isDevice(socket.id)) {
        const sockets = await Connection.getByCode(
          await Connection.getLampCode(socket.id)
        );
        for (const socketId of sockets) {
          io.to(socketId).emit("addconnection", false);
        }
      }

      await Connection.remove(socket.id);
    });
  });

  server.listen(PORT, () => {
    console.log(`Listening on *:${PORT}`);
  });
});
