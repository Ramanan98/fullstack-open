import type { DiaryEntry } from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

export const getAllDiaries = async (): Promise<DiaryEntry[]> => {
  const response = await fetch(baseUrl);
  return response.json();
};
