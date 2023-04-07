
// export const SUPPORTED_LANGUAGES = ["en", "es", "it"]
// this syntax is equals to "en" | "es" | "it"
// export type Language = typeof SUPPORTED_LANGUAGES[number]

export type User = {
  id: number,
  email: string,
  surname: string,
  authenticationToken?: string | null
};