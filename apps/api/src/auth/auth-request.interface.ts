import type { Request } from 'express';
import {MongoId} from "../common/mongo-id-type";

export interface AuthenticatedRequest extends Request {
  user: { userId: MongoId };
}
