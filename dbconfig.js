const mongoose = require("mongoose");

const db = process.env.MONGODB_URI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log(`DB here, I'm up🔥`))
  .catch((err) => console.log(err));
