import { Request, Response } from "express";
import { IAuthService } from "../services/interfaces";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as { email: string; password: string };
    const result = await this.authService.login(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  };
}
