import { Router } from "express";
import {
  createQuestion,
  getQuestions,
  deactivateQuestion,
} from "./controller.js";

const questionRouter = Router();

questionRouter.get("/questions", getQuestions);
questionRouter.post("/questions", createQuestion);
questionRouter.patch("/questions/:id/deactivate", deactivateQuestion);

export default questionRouter;