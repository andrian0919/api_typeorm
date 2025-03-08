export class CreateUserDto {
    title: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    password: string; // Temporary field for password
    confirmPassword: string; // Temporary field for confirmPassword
  }
  
  export class UpdateUserDto {
    title?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    email?: string;
    password?: string; // Temporary field for password
    confirmPassword?: string; // Temporary field for confirmPassword
  }