import { Request,Response,NextFunction} from "express"
export const notFound=(req:Request,res:Response,next:NextFunction)=>{
    const error = new Error(`Not Found Request`);
    res.status(404);
    next(error);
}
export const errorHandler = (error:Error,req:Request,res:Response,next:NextFunction)=>{
    const stCode = res.statusCode == 200 ? 500 : res.statusCode;

    res.status(stCode)
        .json({
            status:"Failed",
            message:error.message,
            stack:error.stack
        })
}