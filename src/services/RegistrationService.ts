import { ApiError } from "../core/errors/ApiError";
import { CreateRegistrationInput, Registration } from "../models/Registration";
import { IEventRepository, IRegistrationRepository } from "../repos/interfaces";
import { IRegistrationService } from "./interfaces";

export class RegistrationService implements IRegistrationService {
  constructor(
    private readonly registrationRepository: IRegistrationRepository,
    private readonly eventRepository: IEventRepository,
  ) {}

  async registerForEvent(
    input: CreateRegistrationInput,
  ): Promise<Registration> {
    const event = await this.eventRepository.findById(input.eventId);
    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    const alreadyRegistered = await this.registrationRepository.exists(
      input.userId,
      input.eventId,
    );
    if (alreadyRegistered) {
      throw new ApiError(409, "User is already registered for this event");
    }

    return this.registrationRepository.create(input);
  }

  async getMyRegistrations(userId: number): Promise<Registration[]> {
    return this.registrationRepository.findByUserId(userId);
  }

  async getRegistrationsByEvent(eventId: number): Promise<Registration[]> {
    return this.registrationRepository.findByEventId(eventId);
  }
}
