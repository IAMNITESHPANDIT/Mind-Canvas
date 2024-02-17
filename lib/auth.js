import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
export function generateToken(userId, role) {
  const token = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "1h" });
  return token;
}


export function generateRefreshToken(userId) {
  const payload = {
    userId: userId,
    expiresIn: '1d',
  };

  return jwt.sign(payload, JWT_SECRET); 
}
