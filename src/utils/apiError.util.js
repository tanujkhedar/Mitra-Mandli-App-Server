class ApiError extends Error {
    constructor (
        statusCode,
        message = "something went wrong",
        errors = ["something went wrong"],
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.success = false;

        Error.captureStackTrace(this, this.constructor); // this, this.constructor stack ko clean karte hai , stack me apiError refrence track hatate hai
    }
}

export { ApiError }