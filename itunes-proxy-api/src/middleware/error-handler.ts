import { GeneralError, InternalServerError } from "../utils/errors";
import { ErrorRequestHandler } from "express";

interface OpenApiValidationError {
    status: number;
    message: string;
    errors: Array<object>;
}

function isOpenApiValidationError(obj: unknown): obj is OpenApiValidationError {
    const openApiValidationError = obj as OpenApiValidationError;
    return (
        openApiValidationError?.status !== undefined &&
        openApiValidationError?.message !== undefined &&
        openApiValidationError?.errors !== undefined
    );
}

export const customErrorRequestHandler: ErrorRequestHandler = (error, req, res, next) => {
    let status;
    let message;
    let details;
    if (error instanceof GeneralError) {
        status = error.status;
        message = error.message;
        details = error.details;
    } else if (isOpenApiValidationError(error)) {
        status = error.status;
        message = error.message;
        details = { errors: error.errors };
    } else {
        console.error("Unhandled error", { error });
        const internalServerError = new InternalServerError(error);
        status = internalServerError.status;
        message = internalServerError.message;
        details = internalServerError.details;
    }

    res.status(status).json({ status, message, details });
};
