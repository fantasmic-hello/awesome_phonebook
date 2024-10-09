const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const url = process.env.MONGO_URL;
console.log("connecting to ", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("could not connect to mongodb", error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema)
