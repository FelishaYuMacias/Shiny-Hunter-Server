const { User } = require('../models');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const db = require('../config/connection');

db.once('open', async () => {
  let data =
    {
      "username": "seeduser",
      "password": "password"
    }
    let saltRounds = 10;
    let hashedPassword = await bcrypt.hash(data.password, saltRounds);
  
    data.password = hashedPassword;
    console.log(data.password);
  
    const seedDatabase = async () => {
      try {
        await User.deleteMany({});
        await User.insertMany(data);
        console.log('Seeding successful');
      } catch (error) {
        console.log(error);
      }
    };
  
    seedDatabase().then(() => {
      mongoose.connection.close();
    });
  })