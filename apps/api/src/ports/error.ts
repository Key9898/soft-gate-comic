export class IntegrationError extends Error {
  readonly code: string

  constructor(code: string) {
    super(code)
    this.name = 'IntegrationError'
    this.code = code
  }
}
