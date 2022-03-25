const mongoose = require('mongoose');
mongoose.promise = global.promise;
const db={};
db.mongoose = mongoose;
db.user =require('./user.model')
db.role = require('./role.model')
db.ROLES -["user","admin",];





module.exports = db;