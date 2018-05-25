export class HttpException extends Error {
    private readonly status;
    private readonly response;
    private readonly message;

    constructor(response: string | object, status: number) {
        super();
        this.response = response;
        this.status = status;
        this.message = response;
    }
    getResponse() {
        return this.response;
    }
    getStatus() {
        return this.status;
    }
    getMessage() {
        return this.message;
    }
}
