import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.stausCode).json({ message: err.message });
  }

  return res.status(500).json({ message: err.message });
};

class CustomError extends Error {
  constructor(public stausCode: number, public message: string) {
    super(message);
    this.stausCode = stausCode;
  }
}

export { errorHandler, CustomError };
