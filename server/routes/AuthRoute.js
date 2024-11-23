import express from 'express'
import { checkUser, generateToken, getAllUsers, onBoardUser } from '../controllers/AuthController.js';
import getPrismaInstance from '../utils/PrismaClient.js';

const router = express.Router(); 

//router for checkUser
router.post('/check-user', checkUser); 
//router for onboarding
router.post('/onboard-user', onBoardUser)
//router for getting all users in ChatContainer
router.get('/get-contacts', getAllUsers)

//route for tokens with ZegoCloud
router.get("/generate-token/:userId", generateToken)

// In /server/routes/AuthRoute.js
router.get('/test-db-connection', async (req, res) => {
  const prisma = getPrismaInstance();
  try {
    await prisma.$queryRaw`SELECT 1`; // Simple query to test connection
    return res.status(200).json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

export default router; 