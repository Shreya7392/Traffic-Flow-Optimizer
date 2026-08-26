import { Router, type IRouter } from "express";
import { db, roadsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { publish, subscribe } from "../lib/live";

const router: IRouter = Router();

router.get("/events", (_req, res) => subscribe(res));

router.post("/simulation/tick", async (req, res) => {
  try {
    const roads = await db.select().from(roadsTable);
    const updates = await Promise.all(roads.map(async (road) => {
      const change = Math.floor(Math.random() * 7) - 3;
      const carCount = Math.max(0, road.carCount + change);
      return db.update(roadsTable).set({ carCount }).where(eq(roadsTable.id, road.id)).returning();
    }));
    publish("traffic-updated", { roads: updates.flat().length });
    res.json({ updatedRoads: updates.flat().length });
  } catch (err) {
    req.log.error({ err }, "Failed to simulate traffic");
    res.status(500).json({ error: "Unable to simulate traffic" });
  }
});

export default router;
