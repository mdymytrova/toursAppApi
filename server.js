const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL.replace("<USER>", process.env.DB_USER).replace(
  "<PASS>",
  process.env.DB_PASS
);

mongoose.connect(dbUrl).then(() => {
  console.log("Connected to database");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
