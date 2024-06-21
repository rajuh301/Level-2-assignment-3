import { Request } from 'express';
import { JwtPayload } from "jsonwebtoken"

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload
        }
    }
}




export interface AuthRequest extends Request {
    user?: JwtPayload & { id?: string, _id?: string };  // Add properties you expect
  }




export interface AuthRequest extends Request {
  user 
}
