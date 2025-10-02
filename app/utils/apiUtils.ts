export const formatArrayForApi = (data: string | string[] | null): string[] => {
  if (!data) {
    return [];
  }

  if (typeof data === "string") {
    return [data];
  }

  return data;
};
