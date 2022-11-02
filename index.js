const mongoose = require("mongoose");
const express = require("express");

// variables for getting server started
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/so-so-social',
  {
    // useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

mongoose.set("debug", true);

app.listen(PORT, () => console.log(`Connected on localhost:${PORT}`));

module.exports = mongoose.connection;