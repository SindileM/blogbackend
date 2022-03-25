const db = require("../models");
const ROLES = db.ROLES;
// const User = db.user;

const User = require("../models/user.model");

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  let user;
  try {
    user = await User.findOne({ username: req.body.username });
    email = await User.findOne({ email: req.body.email });
    if (user || email) {
      return res
        .status(404)
        .send({ message: "username or email already exists." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  next();
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};
module.exports = verifySignUp;
