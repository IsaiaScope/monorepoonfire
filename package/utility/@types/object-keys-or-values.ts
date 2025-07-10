// Get keys type from a obj type
type TypesKeys<T, AllowTypes> = {
  [K in keyof T]: K extends AllowTypes ? K : never;
}[keyof T];

export type StringKeys<T> = TypesKeys<T, string>;

export type NumericKeys<T> = TypesKeys<T, number>;

export type AllKeys<T> = keyof T;

// Get values type from a obj type
type TypesValues<T, AllowTypes> = {
  [K in keyof T]: T[K] extends AllowTypes ? T[K] : never;
}[keyof T];

export type StringValues<T> = TypesValues<T, string>;

export type NumericValues<T> = TypesValues<T, number>;

export type AllValues<T> = T[keyof T];

// Basis usage type Type = AllKeys<typeof Obj>;
