const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const user = require("../models/user");
const cookie = require("cookie");
const fs = require('fs')

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

exports.createAccount = async (req, res, next) => {
  console.log("creating account ");
  if (!validationResult(req).isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let { username, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({
    username: username,
    email: email,
    password: hashedPassword,
  });
  let token;
  let result;
  try {
    result = await user.save();
    token = jwt.sign(
      {
        userId: result._id,
        username: result.username,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later",
      500
    );
    next(error);
  }

  res.status(201).setHeader(
    "Set-Cookie",
    cookie.serialize("Token", token, {
      httpOnly: true,
    })
  );
  res.json({
    message: "User created!",
    userId: result.id,
    username: username,
  });
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  let user;
  const { email, password } = req.body;
  console.log(req.body);
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "A user with that email does not exist. Please sign up first",
      403
    );
    return next(error);
  }

  let validPassword = false;
  try {
    validPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!validPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).setHeader(
    "Set-Cookie",
    cookie.serialize("Token", token, {
      httpOnly: true,
    })
  );

  res.json({
    userId: user.id,
    email: user.email,
    username: user.username,
  });
};

exports.getProfile = async (req, res, next) => {
    let user;
  try {
    user = await User.findById(req.userData.userId)
  } catch (err) {
      console.log(error)
    const error = new HttpError(
      "Fetching profile data failed. Please try again later.",
      500
    );
    return next(error);
  }
  res.status(200).json({
    wordsTyped: user.totalWordsTyped,
    typos: user.totalTypos,
    racesPlayed: user.totalRacesPlayed,
    racesWon: user.totalRacesWon,
    functionsTyped: user.totalFunctionsTyped,
    classesTyped: user.totalClassesTyped,
    timeTyped: user.totalTimeTyping
  });
};

exports.checkToken = (req, res, next) => {
  if (!req.cookies) {
    return res.json({ userId: null });
  }
  let decodedToken;
  try {
    const token = req.cookies.Token;
    console.log(token);
    decodedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return res.json({ userId: null });
  }

  res.json({ userId: decodedToken.userId, username: decodedToken.username });
};

exports.logout = (req, res, next) => {
  console.log("clearing cookie");
  res
    .status(201)
    .setHeader(
      "Set-Cookie",
      cookie.serialize("Token", null, {
        httpOnly: true,
      })
    )

    res.json({
      loggedOut: true,
    });
};

exports.getPhrase = (req,res,next) => {
    const data = fs.readFileSync(
        `./codeSnippets/${getRandomInt(0, 9)}.txt`,
        "utf8"
      );
    res.status(200)
    res.json({phrase: data.slice(0, data.length-2)})
}