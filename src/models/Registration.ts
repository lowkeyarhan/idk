export interface Registration {
  registrationId: number;
  userId: number;
  eventId: number;
  studentIdPath: string | null;
  registeredAt: Date;
}

export interface CreateRegistrationInput {
  userId: number;
  eventId: number;
  studentIdPath?: string | null;
}
