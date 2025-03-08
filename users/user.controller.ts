import express from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validate-request';
import { Role } from '../_helpers/role';
import { userService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto'; // Import the DTOs

const router = express.Router();

// Routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

export default router;

// Route functions
function getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
  userService.getAll()
    .then(users => res.json(users))
    .catch(next);
}

function getById(req: express.Request, res: express.Response, next: express.NextFunction) {
  userService.getById(parseInt(req.params.id))
    .then(user => res.json(user))
    .catch(next);
}

function create(req: express.Request, res: express.Response, next: express.NextFunction) {
  userService.create(req.body)
    .then(() => res.json({ message: 'User created' }))
    .catch(next);
}

function update(req: express.Request, res: express.Response, next: express.NextFunction) {
  userService.update(parseInt(req.params.id), req.body)
    .then(() => res.json({ message: 'User updated' }))
    .catch(next);
}

function _delete(req: express.Request, res: express.Response, next: express.NextFunction) {
  userService.delete(parseInt(req.params.id))
    .then(() => res.json({ message: 'User deleted' }))
    .catch(next);
}

// Schema functions
function createSchema(req: express.Request, res: express.Response, next: express.NextFunction) {
  const schema = Joi.object({
    title: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid(Role.Admin, Role.User).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
  });
  validateRequest(req, next, schema);
}

function updateSchema(req: express.Request, res: express.Response, next: express.NextFunction) {
  const schema = Joi.object({
    title: Joi.string().empty(''),
    firstName: Joi.string().empty(''),
    lastName: Joi.string().empty(''),
    role: Joi.string().valid(Role.Admin, Role.User).empty(''),
    email: Joi.string().email().empty(''),
    password: Joi.string().min(6).empty(''),
    confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
  }).with('password', 'confirmPassword');
  validateRequest(req, next, schema);
}