import {Request, Response, NextFunction  } from 'express'

export let middlewareCheckSale = (req: Request, res: Response, next: NextFunction )=>{
  let saleSession = req.session.saleInProcess
  if(saleSession){
    res.redirect('/finalizing-Sale')
  }else{
    next()
  }

}