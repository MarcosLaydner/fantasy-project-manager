export class ApplicationError {
  constructor (
    public readonly message: string,
    public readonly code: number
  ) {}
}
