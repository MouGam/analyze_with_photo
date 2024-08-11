const { Sequelize } = require('sequelize');
const {Users} = require('./models/users');
const {Counsels} = require('./models/counsel');
const {Diagnoses} = require('./models/diagnose');

require('dotenv').config();

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('', process.env.DB_USER, process.env.DB_PW, {
  host: process.env.DB_ENDPOINT,
  dialect: 'postgres'
});
const db = {};

db.sequelize = sequelize;

db.Users = Users;
db.Counsels = Counsels;
db.Diagnoses = Diagnoses;

Users.initiate(sequelize);
Counsels.initiate(sequelize);
Diagnoses.initiate(sequelize);

Users.associate(db);
Counsels.associate(db);
Diagnoses.associate(db);

module.exports = {sequelize};