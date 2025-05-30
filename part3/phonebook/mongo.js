const mongoose = require('mongoose');
require('dotenv').config();

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const password = process.env.MONGO_PASSWORD;
const url = `mongodb+srv://ramanan:${password}@cluster0.vivbq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url)
  .then(() => {
    if (process.argv.length < 4) {
      return Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person);
        });
        return mongoose.connection.close();
      });
    } else {
      const name = process.argv[2];
      const number = process.argv[3];

      const person = new Person({ name, number });

      return person.save().then(result => {
        console.log(`person saved! ${person}`);
        return mongoose.connection.close();
      });
    }
  })
  .catch(err => {
    console.error('Database error:', err);
    mongoose.connection.close();
  });