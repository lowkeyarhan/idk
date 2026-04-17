import { Request, Response } from "express";
import { ApiError } from "../core/errors/ApiError";
import { IRegistrationService } from "../services/interfaces";

const parseId = (value: string | string[]): number => {
  const raw = Array.isArray(value) ? value[0] : value;
  const id = Number.parseInt(raw, 10);
  if (Number.isNaN(id) || id <= 0) {
    throw new ApiError(400, "Invalid numeric id");
  }
  return id;
};

export class RegistrationController {
  constructor(private readonly registrationService: IRegistrationService) {}

  createRegistration = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const registration = await this.registrationService.registerForEvent({
      userId: req.user.userId,
      eventId: req.body.eventId as number,
      studentIdPath: req.file?.path ?? null,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: registration,
    });
  };

  getMyRegistrations = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const registrations = await this.registrationService.getMyRegistrations(
      req.user.userId,
    );

    res.status(200).json({
      success: true,
      data: registrations,
    });
  };

  getRegistrationsByEvent = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const registrations =
      await this.registrationService.getRegistrationsByEvent(
        parseId(req.params.eventId),
      );

    res.status(200).json({
      success: true,
      data: registrations,
    });
  };
}
