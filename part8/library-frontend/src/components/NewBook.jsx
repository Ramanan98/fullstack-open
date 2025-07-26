import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ALL_BOOKS, ALL_AUTHORS, ADD_BOOK } from "../queries";

const NewBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      console.error("Error adding book:", error);
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    try {
      await addBook({
        variables: {
          title,
          author,
          published: parseInt(published),
          genres,
        },
      });

      setTitle("");
      setAuthor("");
      setPublished("");
      setGenres([]);
      setGenre("");
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const addGenre = (event) => {
    event.preventDefault();
    if (genre && !genres.includes(genre)) {
      setGenres([...genres, genre]);
      setGenre("");
    }
  };

  return (
    <div>
      <h2>add book</h2>
      <form onSubmit={submit}>
        <div>
          <label>
            title
            <input
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            published
            <input
              type="text"
              value={published}
              onChange={({ target }) => setPublished(target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            genre
            <input
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />
            <button onClick={addGenre} type="button">
              add genre
            </button>
          </label>
        </div>
        <div>{genres.join(", ")}</div>
        <button type="submit" style={{ marginTop: "10px" }}>
          create book
        </button>
      </form>
    </div>
  );
};

export default NewBook;
