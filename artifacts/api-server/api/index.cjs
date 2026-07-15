const req = eval("require");
try {
  const app = req("../dist/vercel-entry.cjs").default;
  module.exports = app;
} catch (error) {
  module.exports = (req, res) => {
    // Add CORS headers manually so the browser doesn't block the error response
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
    
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    res.status(500).json({
      message: "Initialization Error in Vercel Bundle",
      error: error.message,
      stack: error.stack
    });
  };
}
