export const notFound = (req, res, next) => {
    const error = new Error(`Not Found Request`);
    res.status(404);
    next(error);
};
export const errorHandler = (error, req, res, next) => {
    const stCode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(stCode)
        .json({
        status: "Failed",
        message: error.message,
        stack: error.stack
    });
};
