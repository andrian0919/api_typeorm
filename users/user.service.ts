import { AppDataSource } from '../_helpers/db'; // Import the DataSource
import bcrypt from 'bcryptjs';
import { User } from '../entities/User';
import { Role } from '../_helpers/role';
import { CreateUserDto, UpdateUserDto } from './user.dto'; // Import the DTOs

export const userService = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

async function getAll() {
  const userRepository = AppDataSource.getRepository(User);
  return await userRepository.find();
}

async function getById(id: number) {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id } });
  if (!user) throw 'User not found';
  return user;
}

async function create(params: CreateUserDto) {
  const userRepository = AppDataSource.getRepository(User);

  // Check if email is already registered
  if (await userRepository.findOne({ where: { email: params.email } })) {
    throw `Email "${params.email}" is already registered`;
  }

  // Validate confirmPassword
  if (params.password !== params.confirmPassword) {
    throw 'Password and confirmPassword do not match';
  }

  const user = new User();
  Object.assign(user, params);

  // Hash the password before saving
  if (params.password) {
    user.passwordHash = await bcrypt.hash(params.password, 10);
  } else {
    throw 'Password is required';
  }

  await userRepository.save(user);
}

async function update(id: number, params: UpdateUserDto) {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id } });

  if (!user) throw 'User not found';

  // Check if the new email is already taken
  if (params.email && user.email !== params.email && await userRepository.findOne({ where: { email: params.email } })) {
    throw `Email "${params.email}" is already taken`;
  }

  // Hash the new password if provided
  if (params.password) {
    user.passwordHash = await bcrypt.hash(params.password, 10);
  }

  // Remove temporary fields (password and confirmPassword) before saving
  const { password, confirmPassword, ...updateData } = params;

  Object.assign(user, updateData);
  await userRepository.save(user);
}

async function _delete(id: number) {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id } });

  if (!user) throw 'User not found';

  await userRepository.remove(user);
}