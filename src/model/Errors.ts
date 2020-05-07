export class ValidationError extends Error {
  public attribute: string;
  public value?: any;
  public name = "ValidationError";
  constructor(e: any) {
    super("Validation error");
    const { path, value, type } = e;
    const key = path[0];

    if (value === undefined) {
      this.message = `user_${key}_required`;
      this.attribute = key;
    }

    if (type === undefined) {
      this.message = `user_attribute_unknown`;
      this.attribute = key;
    }

    this.message = `user_${key}_invalid`;
    this.attribute = key;
    this.value = value;
  }
}
