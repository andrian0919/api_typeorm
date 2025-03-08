import { DataSource } from 'typeorm';
import config from '../config.json'; // Ensure correct path
import { User } from '../entities/User';

// Main database connection
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password || '',
  database: config.database.database,
  entities: [User], // Add all entities here
  synchronize: true, // Automatically sync database schema
  logging: false,
});

// Initialize the database connection
export async function initialize() {
  try {
    // Create a temporary connection to ensure the database exists
    const tempConnection = new DataSource({
      type: 'mysql',
      host: config.database.host,
      port: config.database.port,
      username: config.database.user,
      password: config.database.password || '',
      database: 'mysql', // Connect to the default 'mysql' database
      synchronize: false,
      logging: false,
    });

    await tempConnection.initialize();
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database.database}\`;`);
    await tempConnection.destroy(); // Close the temporary connection

    // Initialize the main database connection
    await AppDataSource.initialize();
    console.log('Database connection established');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error; // Re-throw the error to ensure the application doesn't start if the database fails
  }
}