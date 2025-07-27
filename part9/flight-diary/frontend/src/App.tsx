import { useEffect, useState } from "react";
import type { DiaryEntry } from "./types";
import { getAllDiaries } from "./services/diaryService";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const fetchDiaries = async () => {
      const diaries = await getAllDiaries();
      setDiaries(diaries);
    };
    fetchDiaries();
  }, []);

  return (
    <div>
      <h1>Flight Diary</h1>
      {diaries.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>Weather: {diary.weather}</p>
          <p>Visibility: {diary.visibility}</p>
          <p>{diary.comment}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default App;
