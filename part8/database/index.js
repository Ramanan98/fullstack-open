const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

const JWT_SECRET = process.env.SECRET || "SECRET_KEY";

mongoose.set("strictQuery", false);
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

const getValidationError = (error) => {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors)
      .map((e) => e.message)
      .join("; ");
    throw new GraphQLError("Validation error: " + messages, {
      extensions: {
        code: "BAD_USER_INPUT",
        invalidArgs: error.path,
        error,
      },
    });
  }
  throw error;
};

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
  
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }
  
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }
  
  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
  
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_, args) => {
      let query = {};

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          query.author = author._id;
        } else {
          return [];
        }
      }

      if (args.genre) {
        query.genres = args.genre;
      }

      return Book.find(query).populate("author");
    },
    allAuthors: async () => {
      return Author.find({});
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (_, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        let author = await Author.findOne({ name: args.author });

        if (!author) {
          author = new Author({
            name: args.author,
          });
          await author.save().catch(getValidationError);
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          author: author._id,
          genres: args.genres,
        });

        await book.save().catch(getValidationError);
        return book.populate("author");
      } catch (error) {
        getValidationError(error);
      }
    },
    editAuthor: async (_, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        const author = await Author.findOne({ name: args.name });
        if (!author) {
          throw new GraphQLError("Author not found", {
            extensions: {
              code: "NOT_FOUND",
              invalidArgs: args.name,
            },
          });
        }

        author.born = args.setBornTo;
        await author.save().catch(getValidationError);
        return author;
      } catch (error) {
        getValidationError(error);
      }
    },
    createUser: async (_, args) => {
      try {
        const passwordHash = "secret";
        const user = new User({
          username: args.username,
          favoriteGenre: args.favoriteGenre,
          passwordHash,
        });

        await user.save().catch(getValidationError);
        return user;
      } catch (error) {
        getValidationError(error);
      }
    },
    login: async (_, args) => {
      try {
        const user = await User.findOne({ username: args.username });
        const passwordCorrect = user && user.passwordHash === "secret";

        if (!passwordCorrect) {
          throw new GraphQLError("Invalid credentials", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        }

        const userForToken = {
          username: user.username,
          id: user._id,
        };

        return { value: jwt.sign(userForToken, JWT_SECRET) };
      } catch (error) {
        getValidationError(error);
      }
    },
  },
  Author: {
    bookCount: async (root) => {
      const count = await Book.countDocuments({ author: root._id });
      return count;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const token = auth.substring(7);
      try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const currentUser = await User.findById(id);
        return { currentUser };
      } catch (error) {
        return {};
      }
    }
    return {};
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
