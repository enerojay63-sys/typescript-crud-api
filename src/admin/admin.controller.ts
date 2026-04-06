import express, { Response, NextFunction } from 'express';
import { db } from '_helpers/db';
import { authenticateToken, requireAdmin, AuthRequest } from '_helpers/jwt';

const router = express.Router();

router.get('/accounts', authenticateToken, requireAdmin, getAccounts);
router.get('/departments', authenticateToken, requireAdmin, getDepartments);

function getAccounts(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  db.User.findAll()
    .then(users => res.json({ accounts: users }))
    .catch(next);
}

function getDepartments(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  db.Department.findAll()
    .then(departments => res.json({ departments }))
    .catch(next);
}

export default router;