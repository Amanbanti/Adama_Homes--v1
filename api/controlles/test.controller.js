import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req, res) => {
  console.log(req.userId)
  res.status(200).json({ message: "You are Authenticated" });
};

export const shouldBeAdmin = async (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Not Authenticated!" });
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
      if (err) return res.status(403).json({ message: "Token is not Valid!" });
  
      if (!payload.isAdmin) {
        return res.status(403).json({ message: "Not authorized!" });
      }
  
      // If everything is okay, send the success response
      res.status(200).json({ message: "You are Authenticated" });
    });
};
