import express from "express";
const app = express();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import adminRouter from "./src/routes/adminRouter.js";
import path from "path";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import cors from "cors";
app.use(cors({ origin: "*", credentials: true }));
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.DB_BASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(`DB Connected...!`);
  })
  .catch((err) => {
    console.log(`Could not connect to the database. Exiting now...${err}`);
  });
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// const mongo = require('mongodb').MongoClient;
import mongo from "mongodb";
const { MongoClient } = mongo;

import { createServer } from "http";
import client from "socket.io";

const httpServer = createServer();
const io = new client(httpServer, {
  // ...
});

// Connect to mongo
mongo.connect("mongodb://127.0.0.1/social_media", function (err, db) {
  if (err) {
    throw err;
  }
  // Connect to Socket.io
  io.on("connection", function (socket) {
    let chat = db.collection("chats");

    // Create function to send status
    const sendStatus = function (s) {
      socket.emit("status", s);
    };

    // Get chats from mongo collection
    chat
      .find()
      .limit(100)
      .sort({ _id: 1 })
      .toArray(function (err, res) {
        if (err) {
          throw err;
        }

        // Emit the messages
        socket.emit("output", res);
      });

    // Handle input events
    socket.on("input", function (data) {
      let name = data.name;
      let message = data.message;

      // Check for name and message
      if (name == "" || message == "") {
        // Send error status
        sendStatus("Please enter a name and message");
      } else {
        // Insert message
        chat.insert({ name: name, message: message }, function () {
          io.emit("output", [data]);

          // Send status object
          sendStatus({
            message: "Message sent",
            clear: true,
          });
        });
      }
    });

    // Handle clear
    socket.on("clear", function (data) {
      // Remove all chats from collection
      chat.remove({}, function () {
        // Emit cleared
        socket.emit("cleared");
      });
    });
  });

  httpServer.listen(4000);
});
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public/uploads"));
app.use("/", adminRouter);
const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log("Server is listening on port ", port);
});
