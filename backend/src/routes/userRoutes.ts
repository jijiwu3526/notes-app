import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Register endpoint
router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const messages = errors.array().map(e => e.msg).join(', ');
        return res.status(400).json({
          success: false,
          error: messages,
        });
      }

      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email or username already exists',
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, username: newUser.username },
        process.env.JWT_SECRET || 'fallback_secret_key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        data: {
          user: newUser,
          token,
        },
        message: 'User registered successfully',
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
    return;
  }
);

// Login endpoint
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const messages = errors.array().map(e => e.msg).join(', ');
        return res.status(400).json({
          success: false,
          error: messages,
        });
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET || 'fallback_secret_key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        data: {
          user,
          token,
        },
        message: 'Login successful',
      });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
    return;
  }
);

// Get current user profile (requires authentication)
router.get('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
  return;
});

export default router;
