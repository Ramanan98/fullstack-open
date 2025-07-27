import axios from "axios";
import type { DiaryEntry } from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

export const getAllDiaries = async (): Promise<DiaryEntry[]> => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  return response.data;
};

export const createDiary = async (
  newDiary: Omit<DiaryEntry, "id">
): Promise<DiaryEntry> => {
  try {
    const response = await axios.post<DiaryEntry>(baseUrl, newDiary);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error("No response received from server");
      } else {
        throw new Error("Error setting up the request");
      }
    }
    throw error;
  }
};
