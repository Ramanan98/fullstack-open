import { useEffect, useState } from "react";
import type { DiaryEntry } from "./types";
import { getAllDiaries, createDiary } from "./services/diaryService";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [newEntry, setNewEntry] = useState<Omit<DiaryEntry, "id">>({
    date: "",
    weather: "",
    visibility: "",
    comment: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiaries = async () => {
      const diaries = await getAllDiaries();
      setDiaries(diaries);
    };
    fetchDiaries();
  }, []);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const addedEntry = await createDiary(newEntry);
      setDiaries(diaries.concat(addedEntry));
      setNewEntry({ date: "", weather: "", visibility: "", comment: "" });
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  return (
    <div>
      <h1>Add new entry</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          date:
          <input
            type="text"
            name="date"
            value={newEntry.date}
            onChange={handleChange}
          />
        </div>
        <div>
          visibility:
          <input
            type="text"
            name="visibility"
            value={newEntry.visibility}
            onChange={handleChange}
          />
        </div>
        <div>
          weather:
          <input
            type="text"
            name="weather"
            value={newEntry.weather}
            onChange={handleChange}
          />
        </div>
        <div>
          comment:
          <input
            type="text"
            name="comment"
            value={newEntry.comment}
            onChange={handleChange}
          />
        </div>
        <button type="submit">add</button>
      </form>

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
