import { Request, Response, NextFunction } from "express";

export const middlewareGlobal = async (req: Request, res: Response, next: NextFunction)=>{

  res.locals.errors = req.flash('errors')
  next()
  
}