const mongoose = require("mongoose");

async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Connected to database");
    });

    connection.on("error", (error) => {
      console.error("Error connecting to database");
      console.error(error);
    });
  } catch (error) {
    console.error("Error connecting to database");
    console.error(error);
  }
}

module.exports = {
  connect,
};
