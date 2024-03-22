import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

const DBcon = process.env.DB_CON;
const port = process.env.PORT;

mongoose
  .connect(DBcon)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
