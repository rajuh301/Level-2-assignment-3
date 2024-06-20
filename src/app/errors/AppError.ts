class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public errorMessages: { path: string, message: string }[];

  constructor(statusCode: number, message: string, errorMessages: { path: string, message: string }[] = []) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true; // Mark this error as operational
      this.errorMessages = errorMessages;
      
      Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
