import express, { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validate-request';
import { Role } from '../_helpers/role';
import { userService } from './user.service';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', remove);

function getAll(req: Request, res: Response, next: NextFunction): void {
  userService.getAll()
    .then(users => res.json(users))
    .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void {
  userService.getById(Number(req.params.id))
    .then(user => res.json(user))
    .catch(next);
}

function createSchema(req: Request, res: Response, next: NextFunction): void {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid(...Object.values(Role)).required()
  });
  validateRequest(req, next, schema);
}

function create(req: Request, res: Response, next: NextFunction): void {
  const userData = {
    ...req.body,
    passwordHash: req.body.password
  };
  delete userData.password;

  userService.create(userData)
    .then(() => res.json({ message: 'User created successfully' }))
    .catch(next);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
  const schema = Joi.object({
    firstName: Joi.string().empty(''),
    lastName: Joi.string().empty(''),
    email: Joi.string().email().empty(''),
    password: Joi.string().min(6).empty(''),
    role: Joi.string().valid(...Object.values(Role)).empty('')
  });
  validateRequest(req, next, schema);
}

function update(req: Request, res: Response, next: NextFunction): void {
  const params = { ...req.body };
  if (params.password) {
    params.passwordHash = params.password;
    delete params.password;
  }

  userService.update(Number(req.params.id), params)
    .then(() => res.json({ message: 'User updated successfully' }))
    .catch(next);
}

function remove(req: Request, res: Response, next: NextFunction): void {
  userService.remove(Number(req.params.id))
    .then(() => res.json({ message: 'User deleted successfully' }))
    .catch(next);
}

export default router;