// import express from 'express';
import { Request } from 'express';
import { User } from 'src/common/interfaces'

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
