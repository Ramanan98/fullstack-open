import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { useState } from "react";

const Authors = () => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const authors = data?.allAuthors || [];

  const submit = async (event) => {
    event.preventDefault();

    if (!name || !born) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await editAuthor({
        variables: { name, setBornTo: parseInt(born) },
      });

      setName("");
      setBorn("");
    } catch (error) {
      console.error("Error updating author:", error);
    }
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>born</th>
            <th>books</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <label>
            name
            <input
              type="text"
              value={name}
              onChange={({ target }) => setName(target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            born
            <input
              type="number"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
