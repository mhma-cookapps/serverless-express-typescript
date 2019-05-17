export class ApiError extends Error {
  constructor (readonly message: string, readonly name: string, readonly code: number) {
    super(message)
    Object.setPrototypeOf(this, ApiError.prototype)
  }
  toJSON (): Object { return { error: { code: this.code, name: this.name, message: this.message } } }
}

export const err = (message: string, name: string, code: number) => new ApiError(message, name, code)
export const errBadRequest = (message: string) => new ApiError(message, 'bad-request', 400)
export const errUnauthorized = (message: string) => new ApiError(message, 'unauthorized', 401)
export const errInternal = (message: string) => new ApiError(message, 'internal', 500)
