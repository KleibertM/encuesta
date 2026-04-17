import { Router } from "express";
import {
  createQuestion,
  getQuestions,
  deactivateQuestion,
  activateQuestion,
} from "./controller.js";

const questionRouter = Router();

questionRouter.get("/questions", getQuestions);
questionRouter.post("/questions", createQuestion);
questionRouter.patch("/questions/deactivate/:id", deactivateQuestion);
questionRouter.patch("/questions/activate/:id", activateQuestion);

export default questionRouter;