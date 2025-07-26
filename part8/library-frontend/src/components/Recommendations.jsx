import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ME } from "../queries";

const Recommendations = () => {
  const userResult = useQuery(ME);
  const favoriteGenre = userResult.data?.me?.favoriteGenre;

  // GraphQL for querying
  const { loading, error, data } = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre,
  });

  if (userResult.loading) return <div>Loading user data...</div>;
  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (userResult.error) return <div>Error: {userResult.error.message}</div>;

  const books = data?.allBooks || [];

  return (
    <div>
      <h1>recommendations</h1>
      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>

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
    </div>
  );
};

export default Recommendations;
