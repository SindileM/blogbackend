// require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authJwt");


async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find User" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

async function DuplicatedUsernameorEmail(req, res, next) {
  let user;
  try {
    user = await User.findOne({ name: req.body.name });
    email = await User.findOne({ email: req.body.email });
    if (user || email) {
      return res.status(404).send({ message: "name already exists" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}
//getting all user//
router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//getting one user//
router.get("/:id", getUser, (req, res) => {
  res.json(res.user);
});

//creating a new user//
router.post("/signup", DuplicatedUsernameorEmail, async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone_number: req.body.phone_number,
    });
    const newUsername = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//logging in a user//
router.patch("/signin", async (req, res) => {
  try {
    User.findOne({ name: req.body.name }, (err, user) => {
      if (err) return handleError(err);
      if (!user) {
        return res.status(404).send({ message: "user Not found." });
      }
      let passwordIsValid = bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      console.log(process.env.ACCESS_TOKEN_SECRET)
      let token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 86400, 
      });
      res.status(200).send({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        accessToken: token,
        roles:user.roles
      });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.put("/:id", getUser, async (req, res) => {
  if (req.body.id != req.userId) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  if (req.body.phone_number != null) {
    res.user.phone_number = req.body.phone_number;
  }
  if (req.body.join_date != null) {
    res.user.join_date = req.body.join_date;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//deleting a user//
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;