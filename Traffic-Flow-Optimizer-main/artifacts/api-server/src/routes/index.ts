import { Router, type IRouter } from "express";
import healthRouter from "./health";
import intersectionsRouter from "./intersections";
import roadsRouter from "./roads";
import signalsRouter from "./signals";
import hospitalsRouter from "./hospitals";
import ambulancesRouter from "./ambulances";
import statsRouter from "./stats";
import liveRouter from "./live";
import authRouter from "./auth";
import { requireRole } from "../lib/auth";

const router: IRouter = Router();

router.use(authRouter);
router.use((req, res, next) => req.method === "GET" ? next() : requireRole("admin", "operator")(req, res, next));
router.use(healthRouter);
router.use(intersectionsRouter);
router.use(roadsRouter);
router.use(signalsRouter);
router.use(hospitalsRouter);
router.use(ambulancesRouter);
router.use(statsRouter);
router.use(liveRouter);

export default router;
