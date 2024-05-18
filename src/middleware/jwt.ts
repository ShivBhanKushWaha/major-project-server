import jwt from 'jsonwebtoken';

const generateToken = (email:string) => {
  return jwt.sign({ email: email }, process.env.JWT_SECRET as string
  );
};

const verifyToken = (token:string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

export { generateToken, verifyToken };
