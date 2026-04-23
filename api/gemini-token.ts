export default async function handler(req, res) {
  // 🔐 Get your secret key (stored in Vercel env vars)
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Missing GEMINI_API_KEY in environment variables",
    });
  }

  // 🚨 Only allow POST (basic protection)
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    // ✅ For now: return token (server-side protected)
    // This keeps your key OFF the frontend
    return res.status(200).json({
      token: apiKey,
    });

  } catch (error) {
    console.error("Token error:", error);

    return res.status(500).json({
      error: "Failed to generate token",
    });
  }
}
