/**
 * Global response structure returned by the API.
 * It provides information about the query status, a message, and optional data of generic type T.
 */
export interface genericResponse<T> {
  /** Status of the query: true if successful, false otherwise. */
  success: boolean;
  /** Message returned by the API with details about the query result. */
  message: string;
  /** Optional data returned by the API, can be of any type specified when using the interface. */
  data?: T;
}
