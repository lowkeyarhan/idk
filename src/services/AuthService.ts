import { ApiError } from "../core/errors/ApiError";
import { CreateUserInput } from "../dto/UserDTO";
import { IUserRepository } from "../dto/IRepositories";
import { hashPassword, verifyPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { AuthResponse, IAuthService, PublicUser } from "../dto/IServices";

export class AuthService implements IAuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  private toPublicUser(user: {
    userId: number;
    name: string;
    email: string;
    phone: string;
    college: string;
    year: number;
    role: PublicUser["role"];
  }): PublicUser {
    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      college: user.college,
      year: user.year,
      role: user.role,
    };
  }

  async register(input: CreateUserInput): Promise<AuthResponse> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ApiError(409, "Email is already registered");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await this.userRepository.create({
      ...input,
      password: passwordHash,
    });

    const token = generateToken({
      userId: user.userId,
      role: user.role,
    });

    return {
      user: this.toPublicUser(user),
      token,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = generateToken({
      userId: user.userId,
      role: user.role,
    });

    return {
      user: this.toPublicUser(user),
      token,
    };
  }
}
