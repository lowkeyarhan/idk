import { Request, Response } from "express";
import { ApiError } from "../core/errors/ApiError";
import { EventSearchFilters } from "../dto/EventDTO";
import { IEventService } from "../dto/IServices";

const parseId = (value: string | string[]): number => {
  const raw = Array.isArray(value) ? value[0] : value;
  const eventId = Number.parseInt(raw, 10);
  if (Number.isNaN(eventId) || eventId <= 0) {
    throw new ApiError(400, "Invalid event id");
  }
  return eventId;
};

export class EventController {
  constructor(private readonly eventService: IEventService) {}

  listEvents = async (req: Request, res: Response): Promise<void> => {
    const filters = req.query as unknown as EventSearchFilters;
    const events = await this.eventService.listEvents(filters);

    res.status(200).json({
      success: true,
      data: events,
    });
  };

  getEventById = async (req: Request, res: Response): Promise<void> => {
    const event = await this.eventService.getEventById(
      parseId(req.params.eventId),
    );

    res.status(200).json({
      success: true,
      data: event,
    });
  };

  createEvent = async (req: Request, res: Response): Promise<void> => {
    const event = await this.eventService.createEvent(req.body);

    res.status(201).json({
      success: true,
      message: "Event created",
      data: event,
    });
  };

  updateEvent = async (req: Request, res: Response): Promise<void> => {
    const event = await this.eventService.updateEvent(
      parseId(req.params.eventId),
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Event updated",
      data: event,
    });
  };

  deleteEvent = async (req: Request, res: Response): Promise<void> => {
    await this.eventService.deleteEvent(parseId(req.params.eventId));

    res.status(200).json({
      success: true,
      message: "Event deleted",
    });
  };

  getCategorySummary = async (_req: Request, res: Response): Promise<void> => {
    const summary = await this.eventService.getCategorySummary();

    res.status(200).json({
      success: true,
      data: summary,
    });
  };
}
