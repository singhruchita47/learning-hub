import { Router, type IRouter } from "express";
import healthRouter from "./health";
import questionsRouter from "./questions";
import quizRouter from "./quiz";
import runCodeRouter from "./runCode";
import academicRouter from "./academic";
import authRouter from "./auth";
import aiRouter from "./ai";
import attendanceRouter from "./attendance";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/questions", questionsRouter);
router.use("/quiz", quizRouter);
router.use("/academic", academicRouter);
router.use("/auth", authRouter);
router.use("/ai", aiRouter);
router.use("/attendance", attendanceRouter);
router.use("/admin", adminRouter);
router.use(runCodeRouter);

export default router;
