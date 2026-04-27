import express, { Response, NextFunction } from 'express';
import Joi from 'joi';
import { validateRequest } from '_middleware/validate-request';
import { authService } from 'auth/auth.service';
import { authenticateToken, AuthRequest } from '_helpers/jwt';

const router = express.Router();

router.post('/register', registerSchema, register);
router.post('/verify-email', verifyEmail);
router.post('/login', loginSchema, login);
router.get('/profile', authenticateToken, getProfile);

function registerSchema(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  validateRequest(req, next, schema);
}

function register(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  authService
    .register(req.body)
    .then(() =>
      res.json({ message: 'Registration successful! Please verify your email.' })
    )
    .catch(next);
}

function verifyEmail(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const { email } = req.body;
  authService
    .verifyEmail(email)
    .then(() =>
      res.json({ message: 'Email verified successfully! You can now login.' })
    )
    .catch(next);
}

function loginSchema(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

function login(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const { email, password } = req.body;
  authService
    .login(email, password)
    .then(data => res.json(data))
    .catch(next);
}

function getProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  authService
    .getProfile(req.user.id)
    .then(user => res.json(user))
    .catch(next);
}

export default router;