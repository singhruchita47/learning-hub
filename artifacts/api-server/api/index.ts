import type { Request, Response } from "express";

export default function (req: Request, res: Response) {
  try {
    const appModule = require("../src/app");
    const app = appModule.default || appModule;
    return app(req, res);
  } catch (error: any) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
    
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    res.status(500).json({
      message: "Initialization Error in Vercel Bundle",
      error: error?.message || String(error),
      stack: error?.stack
    });
  }
}
