// server/routes/moleculesRoutes.ts
import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

router.post("/generate", async (req, res) => {
  const payload = req.body;

  const API_KEY = "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";
  const invokeUrl = "https://health.api.nvidia.com/v1/biology/nvidia/molmim/generate";

  try {
    const response = await fetch(invokeUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error calling NVIDIA API:", error);
    res.status(500).json({ message: "Failed to generate molecules" });
  }
});

export default router;
