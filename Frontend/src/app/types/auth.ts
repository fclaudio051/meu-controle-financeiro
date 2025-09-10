/**
 * @fileoverview Defines the data transfer objects (DTOs) and response types for authentication.
 * This file is essential for ensuring type safety across API calls and components.
 */

/**
 * Data transfer object for user login.
 * Contains the user's email and password.
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Data transfer object for user registration.
 * Contains the user's email and password for creating a new account.
 */
export interface RegisterDto {
  email: string;
  password: string;
}

/**
 * The response object expected from a successful authentication (login or register) API call.
 * Contains a JWT token and a message.
 */
export interface AuthResponse {
  token: string;
  message: string;
}
