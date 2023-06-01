import * as express from "express";

//
const app = express();

app.use("/", (_, res) => {
  res.json("Hi from Chat server");
});

app.listen(3010, () => {
  console.log("Chat server started successfully!");
});
