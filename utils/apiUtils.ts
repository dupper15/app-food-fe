/**
 * Ensures that the data is properly formatted as a JSON array
 * for API endpoints that expect arrays in the request body
 */
export const formatArrayForApi = (data: string | string[] | null): string[] => {
  if (!data) {
    return [];
  }

  if (typeof data === "string") {
    return [data];
  }

  return data;
};
