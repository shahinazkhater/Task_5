import express from "express";

import authorsRouter from "./routes/authors.route.js";

import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();


// Middleware for JSON body
app.use(express.json());


// Authors Router
app.use("/authors", authorsRouter);


// Global Error Handler
app.use(errorHandler);


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});