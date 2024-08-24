import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import jwt from "jsonwebtoken"


export const register = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
  
      res.status(201).json({ message: "User created successfully", user: newUser });
  
    } catch (err) {
      // Check for specific Prisma error codes
      if (err.code === 'P2002' && err.meta && err.meta.target === 'user_email_key') {
        return res.status(400).json({ message: "Email already in use!" });
      }
  
      console.log(err);
      res.status(500).json({ message: "Failed to create user!" });
    }
  };






export const login = async (req, res) => {
    const {username, password} =req.body;

    try{
        //check if the user exists

        const user = await prisma.user.findUnique({

            where:{username}

        })


        if(!user) return res.status(401).json({message: "Invalid Creadentials"});


        //check if te password is correct

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid) return res.status(401).json({message: "Invalid Credentials!"});
        
        const {password: userpassword, ...userInfo} = user



        //generate cooke token and send to the user
        const maxAge = 60 * 60 * 24 * 7;  // 1 week in seconds
        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: maxAge }
        );
        
        // Correct syntax for setting the cookie
        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Max-Age=${maxAge}`).json(userInfo);
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Failed to login!"})

    }
 

};


export const logout = (req, res) => {
   res.clearCookie("token").status(200).json({message:"Logout Succesuful!"})
};
