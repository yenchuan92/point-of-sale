import Controller from "../Controller.js";
import express from "express";

const router = express.Router();

// GET inventory
router.get("/inventory", async (req, res) => {
  try {
    const result = await Controller.getInventory();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// POST new order (and also update inventory)
router.post("/addOrder", async (req, res) => {
  try {
    const result = await Controller.addOrder(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
