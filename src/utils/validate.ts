// import { compareSync } from "bcrypt";
import isEmpty from "is-empty";

export const existsOrError = (value: any, message: string): void | Error => {
  if (isEmpty(value)) throw new Error(message);
  if (!value) throw new Error(message);
  if (Array.isArray(value) && value.length === 0) throw new Error(message);
  if (typeof value === 'string' && !value.trim()) throw new Error(message);
  if (typeof value === 'number' && !Number(value)) throw new Error(message);

  return;
};

export const notExistisOrError = (value: any, message: string) => {
  try {
    existsOrError(value, message);
  } catch (message) {
    return;
  }

  throw new Error(message);
};

export const equalsOrError = (valueA: any, valueB: any, message: string) => {
  if (valueA !== valueB) throw new Error(message);
};

// export const isMatch = (credentials: CredentialsDomain, user: User) => compareSync(credentials.password, user.password);
