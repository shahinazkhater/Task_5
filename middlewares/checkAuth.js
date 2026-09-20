import jwt from "jsonwebtoken";

export function checkAuth(req, res, next) {
  const token = req.cookies.node_api_token;

  if (!token) {
    return res.status(401).json({ error: "invalid token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
}