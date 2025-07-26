import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { useState, useEffect } from "react";
import Select from "react-select";

const Authors = () => {
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [born, setBorn] = useState("");
  const [authorOptions, setAuthorOptions] = useState([]);

  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  useEffect(() => {
    if (data?.allAuthors) {
      const options = data.allAuthors.map((author) => ({
        value: author.name,
        label: author.name,
        born: author.born,
      }));
      setAuthorOptions(options);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const authors = data?.allAuthors || [];

  const submit = async (event) => {
    event.preventDefault();

    if (!selectedAuthor || !born) {
      alert("Please select an author and enter a birth year");
      return;
    }

    try {
      await editAuthor({
        variables: {
          name: selectedAuthor.value,
          setBornTo: parseInt(born),
        },
      });

      setSelectedAuthor(null);
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
            author
            <Select
              value={selectedAuthor}
              onChange={setSelectedAuthor}
              options={authorOptions}
              isClearable
              isSearchable
              className="react-select-container"
              classNamePrefix="react-select"
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
