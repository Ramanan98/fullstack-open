import type { DiaryEntry } from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

export const getAllDiaries = async (): Promise<DiaryEntry[]> => {
  const response = await fetch(baseUrl);
  return response.json();
};

export const createDiary = async (
  newDiary: Omit<DiaryEntry, "id">
): Promise<DiaryEntry> => {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newDiary),
  });
  return response.json();
};
