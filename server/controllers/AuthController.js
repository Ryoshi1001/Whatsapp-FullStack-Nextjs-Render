import getPrismaInstance from '../utils/PrismaClient.js';
import { generateToken04 } from '../utils/TokenGenerator.js';

//checkuser controller for login on login page
export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.json({ msg: 'Email is required', status: false });
    }
    const prisma = getPrismaInstance();
    console.log("Prisma Instance: ", prisma ? "Created" : "Failed to Create"); 
    console.log('Searching for user with email', email)
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("User Found: ", user ? "Yes" : "No"); 

    if (!user) {
      console.log("User Not Found For Email", email)
      return res.json({ msg: 'User not found', status: false });
    } else {
      return res.json({ msg: 'User found', status: true, data: user });
    }
  } catch (error) {
    next(error);
    console.error('Error in CheckUser authController: ', error.message);
    return res.status(500).json({ msg: 'Internal Server Error', error: error.message, status: false})
  }
};

//controller for user onBoarding page
export const onBoardUser = async (req, res, next) => {
  try {
    const {email, name, about, image:profilePicture} = req.body; 
    if (!email || !name || !profilePicture) {
      return res.send("Email, Name and Image are required.")
    }
    const prisma = getPrismaInstance()
    const user = await prisma.user.create({
      data: { email, name, about, profilePicture }
    })
    return res.json({ ms: "Success new user added", status: true, user})
  } catch (error) {
    next(error)
  }
}


//controller for getting users in ChatContainer
export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance()
    const users = await prisma.user.findMany({
      orderBy: {name: "asc"}, 
      select: {
        id: true, 
        email: true, 
        name: true, 
        profilePicture: true, 
        about: true, 
      }
    })
    const usersGroupedByInitialLetter = {}; 

    users.forEach((user) => {
      const initialLetter = user.name.charAt(0).toUpperCase(); 
      if (!usersGroupedByInitialLetter[initialLetter]) {
        usersGroupedByInitialLetter[initialLetter] = []; 
      }
      usersGroupedByInitialLetter[initialLetter].push(user); 
    })
    return res.status(200).send({usersGroupedByInitialLetter})
  } catch (error) {
    next(error)
  }
}

//TOKEN FOR ZEGOCLOUD 
export const generateToken = (req, res, next) => {
  try {
    const appId = parseInt(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_SECRET;
    const userId = req.params.userId;
    const effectiveTime = 3600;
    const payLoad = "";

    if (appId && serverSecret && userId) {
      const token = generateToken04(appId, userId, serverSecret, effectiveTime, payLoad);
      res.status(200).json({ token });
    } else {
      return res.status(400).send("User id, app id and server secret are required");
    }
  } catch (error) {
    console.log("Error: generateToken function AuthController.js file", error);
    next(error);
  }
};