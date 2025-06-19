export const error = (error: string): never => {
    throw new Error(error);
}