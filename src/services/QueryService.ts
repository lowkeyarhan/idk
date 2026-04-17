import { sendMail } from "../config/mailer";
import { ApiError } from "../core/errors/ApiError";
import {
  CreateQueryInput,
  QueryFilters,
  QueryTicket,
} from "../dto/QueryTicketDTO";
import { IQueryRepository } from "../dto/IRepositories";
import { createSpamGuard } from "../utils/spamGuard";
import { IQueryService } from "../dto/IServices";
import { logger } from "../utils/logger";

export class QueryService implements IQueryService {
  // Closure-based anti-spam guard per email address for query submissions.
  private readonly allowSubmission = createSpamGuard(10 * 60 * 1000, 3);

  constructor(private readonly queryRepository: IQueryRepository) {}

  async createQuery(input: CreateQueryInput): Promise<QueryTicket> {
    const key = input.email.trim().toLowerCase();

    if (!this.allowSubmission(key)) {
      throw new ApiError(
        429,
        "Too many queries from this email. Please try later.",
      );
    }

    return this.queryRepository.create({
      ...input,
      email: key,
      name: input.name.trim(),
      question: input.question.trim(),
    });
  }

  async listQueries(filters: QueryFilters): Promise<QueryTicket[]> {
    return this.queryRepository.findAll(filters);
  }

  async respondToQuery(
    queryId: number,
    response: string,
  ): Promise<QueryTicket> {
    const existing = await this.queryRepository.findById(queryId);
    if (!existing) {
      throw new ApiError(404, "Query not found");
    }

    const updated = await this.queryRepository.respond(
      queryId,
      response.trim(),
    );
    if (!updated) {
      throw new ApiError(500, "Failed to update query response");
    }

    try {
      await sendMail(
        updated.email,
        `Your query #${updated.queryId} has been resolved`,
        `Hello ${updated.name},\n\nYour question:\n${updated.question}\n\nOrganizer response:\n${updated.response}\n\nRegards,\nTech Fest Team`,
      );
    } catch (error) {
      // Email failure should not rollback a successful response update.
      logger.error("Failed to send response email", {
        queryId,
        error: error instanceof Error ? error.message : "Unknown email error",
      });
    }

    return updated;
  }
}
