export const errorHandler = (err, req, res, next) => {
    res
    .status(err.statusCode || 500)
    .json(
        {
            statusCode : err.statusCode || 500,
            message : err.message || "Internel server error",
            errors : err.errors ||[],
            success : false,
            stack : err.stack || undefined
        }
    )
}