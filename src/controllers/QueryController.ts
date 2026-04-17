import { Request, Response } from "express";
import { ApiError } from "../core/errors/ApiError";
import { QueryFilters } from "../dto/QueryTicketDTO";
import { IQueryService } from "../dto/IServices";

const parseId = (value: string | string[]): number => {
  const raw = Array.isArray(value) ? value[0] : value;
  const id = Number.parseInt(raw, 10);
  if (Number.isNaN(id) || id <= 0) {
    throw new ApiError(400, "Invalid query id");
  }
  return id;
};

export class QueryController {
  constructor(private readonly queryService: IQueryService) {}

  createQuery = async (req: Request, res: Response): Promise<void> => {
    const query = await this.queryService.createQuery(req.body);

    res.status(201).json({
      success: true,
      message: "Query submitted",
      data: query,
    });
  };

  listQueries = async (req: Request, res: Response): Promise<void> => {
    const queries = await this.queryService.listQueries(
      req.query as unknown as QueryFilters,
    );

    res.status(200).json({
      success: true,
      data: queries,
    });
  };

  getFaq = async (_req: Request, res: Response): Promise<void> => {
    const resolvedQueries = await this.queryService.listQueries({
      status: "resolved",
      sortBy: "created_at",
      sortOrder: "desc",
    });

    res.status(200).json({
      success: true,
      data: resolvedQueries,
    });
  };

  respondToQuery = async (req: Request, res: Response): Promise<void> => {
    const resolved = await this.queryService.respondToQuery(
      parseId(req.params.queryId),
      req.body.response as string,
    );

    res.status(200).json({
      success: true,
      message: "Query resolved",
      data: resolved,
    });
  };
}
