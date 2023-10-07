import express from "express";
import cors from "cors";

import router from "./routes/routes.js";

const app = express();

// using express middleware so the application can parse JSON
app.use(express.json());
app.use(cors());

app.use("/", router);

app.listen(8000, () => {
  console.log("Server started successfully on port 8000!");
});
