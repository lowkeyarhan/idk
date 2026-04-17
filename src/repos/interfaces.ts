import { CreateEventInput, Event, EventSearchFilters } from "../models/Event";
import { CreateRegistrationInput, Registration } from "../models/Registration";
import {
  CreateQueryInput,
  QueryFilters,
  QueryTicket,
} from "../models/QueryTicket";
import { CreateUserInput, User } from "../models/User";

export interface IUserRepository {
  create(input: CreateUserInput): Promise<User>;
  findById(userId: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}

export interface IEventRepository {
  create(input: CreateEventInput): Promise<Event>;
  update(
    eventId: number,
    input: Partial<CreateEventInput>,
  ): Promise<Event | null>;
  delete(eventId: number): Promise<boolean>;
  findById(eventId: number): Promise<Event | null>;
  findAll(filters: EventSearchFilters): Promise<Event[]>;
}

export interface IRegistrationRepository {
  create(input: CreateRegistrationInput): Promise<Registration>;
  exists(userId: number, eventId: number): Promise<boolean>;
  findByUserId(userId: number): Promise<Registration[]>;
  findByEventId(eventId: number): Promise<Registration[]>;
}

export interface IQueryRepository {
  create(input: CreateQueryInput): Promise<QueryTicket>;
  findById(queryId: number): Promise<QueryTicket | null>;
  findAll(filters: QueryFilters): Promise<QueryTicket[]>;
  respond(queryId: number, response: string): Promise<QueryTicket | null>;
}
