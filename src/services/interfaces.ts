import { CreateEventInput, Event, EventSearchFilters } from "../models/Event";
import { CreateRegistrationInput, Registration } from "../models/Registration";
import {
  CreateQueryInput,
  QueryFilters,
  QueryTicket,
} from "../models/QueryTicket";
import { CreateUserInput, UserRole } from "../models/User";

export interface PublicUser {
  userId: number;
  name: string;
  email: string;
  phone: string;
  college: string;
  year: number;
  role: UserRole;
}

export interface AuthResponse {
  user: PublicUser;
  token: string;
}

export interface IAuthService {
  register(input: CreateUserInput): Promise<AuthResponse>;
  login(email: string, password: string): Promise<AuthResponse>;
}

export interface IEventService {
  listEvents(filters: EventSearchFilters): Promise<Event[]>;
  getEventById(eventId: number): Promise<Event>;
  createEvent(input: CreateEventInput): Promise<Event>;
  updateEvent(
    eventId: number,
    input: Partial<CreateEventInput>,
  ): Promise<Event>;
  deleteEvent(eventId: number): Promise<void>;
  getCategorySummary(): Promise<Array<{ category: string; count: number }>>;
}

export interface IRegistrationService {
  registerForEvent(input: CreateRegistrationInput): Promise<Registration>;
  getMyRegistrations(userId: number): Promise<Registration[]>;
  getRegistrationsByEvent(eventId: number): Promise<Registration[]>;
}

export interface IQueryService {
  createQuery(input: CreateQueryInput): Promise<QueryTicket>;
  listQueries(filters: QueryFilters): Promise<QueryTicket[]>;
  respondToQuery(queryId: number, response: string): Promise<QueryTicket>;
}
