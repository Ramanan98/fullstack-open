import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genres, setGenres] = useState([]);

  const { loading, error, data, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre || undefined },
  });

  useEffect(() => {
    if (data?.allBooks) {
      const allGenres = new Set();
      data.allBooks.forEach((book) => {
        book.genres.forEach((genre) => allGenres.add(genre));
      });
      setGenres([...allGenres]);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const books = selectedGenre
    ? data?.allBooks?.filter((book) => book.genres.includes(selectedGenre))
    : data?.allBooks || [];

  return (
    <div>
      <h2>books</h2>
      {selectedGenre && (
        <div>
          <strong>{selectedGenre}</strong>
          <button onClick={() => setSelectedGenre(null)}>clear filter</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={`${book.title}-${book.author?.name || "unknown"}`}>
              <td>{book.title}</td>
              <td>{book.author?.name || "Unknown"}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "20px" }}>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            style={{ margin: "0 5px 5px 0" }}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
