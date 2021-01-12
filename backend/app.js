const app = require("express")();
const fs = require("fs");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/user");
const Room = require("./models/room");
const jwt = require("jsonwebtoken");
const routes = require("./routes/routes");

// utility function to wait a certain # of milliseconds
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//utility function to create random string of 24 hex characters to match objectId

app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-type"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(cookieParser());

app.use(routes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rqwox.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then((result) => {
    io.on("connection", (socket) => {
      let gameId = "";
      let sendGameDataID;
      socket.once("create-game", async (arg) => {
        // gameId = new ObjectID()
        let data = fs.readFileSync(
          `./codeSnippets/${getRandomInt(0, 9)}.txt`,
          "utf8"
        );
        let functions = data[data.length-2]
        let classes = data[data.length-1]
        data = data.slice(0, data.length-2)
        let room = new Room({
          // _id: gameId,
          players: [{ name: arg.username, _id: arg.userId }],
          phrase: data,
          functions: functions,
          classes: classes
        });

        room = await room.save();
        gameId = room._id.toString();
        socket.join(gameId);
        // tell him the game id
        socket.emit("gameId-phrase", { gameId: gameId, phrase: data });
        // listen to new emits from frontend
        //sleep to make sure user has redirected first
        await sleep(1000);
        io.in(gameId).emit("game-data", [
          { username: arg.username, speed: 0, wordsTyped: 0 },
        ]);
      });

      socket.once("start-game", async (arg) => {
        console.log("starting game");
        gameId = arg.gameId.toString()
        io.in(gameId).emit("start-game", "now");
        try {
          room = await Room.findById(arg.gameId);
          if (!room) {
            return;
          }
          await sleep(10000);
          sendGameDataID = setInterval(async () => {
            room = await Room.findById(arg.gameId);
            const data = room.players.map((player) => {
              return {
                username: player.name,
                speed: player.speed,
                wordsTyped: player.wordsTyped,
              };
            });
            // data is now an array of players with only their username speed and wordstyped. this ensures their unique userId is not sent to each client
            io.in(gameId).emit("game-data", data);
          }, 1000);
        } catch (err) {
          console.log(err)
        }
      });

      socket.once("join-game", async (arg) => {
        if (arg.username.length === 0) {
          return;
        }
        console.log("player joining");
        socket.join(arg.gameId);
        room = await Room.findById(arg.gameId);
        room.players.push({
          name: arg.username,
          _id: arg.userId,
          speed: 0,
          wordsTyped: 0,
        });
        const data = room.players.map((player) => {
          return {
            username: player.name,
            speed: player.speed,
            wordsTyped: player.wordsTyped,
          };
        });
        room = await room.save();
        socket.emit("phrase", { phrase: room.phrase.toString() });
        // console.log(data)
        io.to(arg.gameId).emit("game-data", data);
      });


    socket.on("close", async (arg) => {
      console.log("clearing");
      console.log(arg.gameId);
      try {
        room = await Room.findById(arg.gameId);
        room.players = room.players.filter(
          (player) => player.name !== arg.username
        );
        console.log(room.players);
        if (room.players.length == 0) {
          await room.delete();
        } else {
          await room.save();
        }
      } catch (err) {
        // console.log(err);
      }
      clearInterval(sendGameDataID);
      socket.disconnect();
    });
    socket.on("disconnect", async (arg) => {
      console.log("disconnecting");
      try {
        room = await Room.findById(gameId);
        if (room.players.length < 2) {
          await room.delete();
          clearInterval(sendGameDataID);
        }
      } catch (err) {
        // console.log(err);
      }
    });

    socket.on("race-update", async (args) => {
      try {
        room = await Room.findById(args.gameId);
        const playerIndex = room.players.findIndex(
          (player) => player._id == args.userId
        );
        room.players[playerIndex].speed = Math.floor(60 * args.words / args.time);
        room.players[playerIndex].wordsTyped = args.words;
        await room.save();
      } catch (err) {
        console.log(err);
      }
    });

    socket.once('finished-race', async args => {
      let user;
      console.log('finished')
      room = await Room.findById(args.gameId)
      user = await User.findById(args.userId)
      user.totalWordsTyped += Math.floor(room.phrase.length / 5)
      user.totalTimeTyping += args.time
      user.totalRacesPlayed++
      user.totalFunctionsTyped += room.functions
      user.totalClassesTyped += room.classes
      console.log(user)
      console.log(room)
      await user.save()
    })
  });
http.listen(process.env.PORT || 4000);
  })
// .catch((err) => console.log(err));
