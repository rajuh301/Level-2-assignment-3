// import { Request, Response, NextFunction } from 'express';


// const errorHandler = (err: AppErro, req: Request, res: Response, next: NextFunction) => {
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';

//     console.error('ERROR 💥', err);

//     res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message,
//         ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
//     });
// };

// export default errorHandler;
