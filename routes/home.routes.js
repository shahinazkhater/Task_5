import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth.js";

export const homeRouter = Router();

/*
  GET /api/home

  Home page endpoint (protected)
*/
homeRouter.get("/home", checkAuth, (req, res) => {
  res.json({
    message: `Welcome to the home page, ${req.user.username}!`,
  });
});