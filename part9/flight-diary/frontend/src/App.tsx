import { useEffect, useState } from "react";
import type { DiaryEntry, NewDiaryEntry, Weather, Visibility } from "./types";
import { getAllDiaries, createDiary } from "./services/diaryService";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [newEntry, setNewEntry] = useState<NewDiaryEntry>({
    date: "",
    weather: "sunny",
    visibility: "great",
    comment: "",
  });
  const [error, setError] = useState<string | null>(null);

  const weatherOptions: Weather[] = [
    "sunny",
    "rainy",
    "cloudy",
    "stormy",
    "windy",
  ];
  const visibilityOptions: Visibility[] = ["great", "good", "ok", "poor"];

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
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  const handleWeatherChange = (weather: Weather) => {
    setNewEntry({ ...newEntry, weather });
  };

  const handleVisibilityChange = (visibility: Visibility) => {
    setNewEntry({ ...newEntry, visibility });
  };

  return (
    <div>
      <h1>Add new entry</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={newEntry.date}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <span>Visibility: </span>
          {visibilityOptions.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="visibility"
                checked={newEntry.visibility === option}
                onChange={() => handleVisibilityChange(option)}
              />
              {option}
            </label>
          ))}
        </div>

        <div>
          <span>Weather: </span>
          {weatherOptions.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="weather"
                checked={newEntry.weather === option}
                onChange={() => handleWeatherChange(option)}
              />
              {option}
            </label>
          ))}
        </div>

        <div>
          <label>
            Comment:
            <input
              type="text"
              name="comment"
              value={newEntry.comment}
              onChange={handleChange}
              required
            />
          </label>
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
