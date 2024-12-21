import axios from "axios";

export class GeneralError extends Error {
    status: number;
    details: unknown;
    constructor(message: string, status: number, details?: unknown) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

export class BadRequest extends GeneralError {
    constructor(message?: string, details?: unknown) {
        super(message || 'Bad Request', 400, details);
    }
}

export class NotFound extends GeneralError {
    constructor(message?: string, details?: unknown) {
        super(message || 'Not Found', 404, details);
    }
}

function getErrorDetails(error: Error | unknown) {
    if (axios.isAxiosError(error)) {
        return {
            name: error.name,
            message: error.message,
            data: error.response?.data,
            status: error.response?.status,
            statusText: error.response?.statusText
        };
    } else if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
        };
    }

    return error;
}

export class InternalServerError extends GeneralError {
    constructor();
    constructor(message: string);
    constructor(error: Error | unknown);
    constructor(message: string, error: unknown);
    constructor(...params: unknown[]) {
        let details;
        let message = 'Internal Server Error';
        if (params.length === 1) {
            if (typeof params[0] === 'string') {
                message = params[0] || message;
            } else {
                details = getErrorDetails(params[0]);
            }
        } else if (params.length === 2) {
            message = params[0] as string || message;
            details = getErrorDetails(params[1]);
        }
        super(message, 500, details);
    }
}

export class UnknownErrorHandler {

    private readonly statusCodeToErrorMap: Record<number, typeof GeneralError> = {
        [400]: BadRequest,
        [404]: NotFound,
        [500]: InternalServerError
    }

    private ifKnownAxiosErrorReturn(error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;
            const { message, result, title } = data;
            const relevantMessage = title ? title : ( message ? message : result);
            if (status in this.statusCodeToErrorMap) {
                return new this.statusCodeToErrorMap[status](relevantMessage, error.response?.data);
            }
        }
    }

    getHandledError(error: unknown) {
        const ifGeneralErrorReturn = () => error instanceof GeneralError ? error : null;
        return ifGeneralErrorReturn() || this.ifKnownAxiosErrorReturn(error) || new InternalServerError(error);
    }
}
