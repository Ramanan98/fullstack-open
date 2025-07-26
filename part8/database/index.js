const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const mongoose = require("mongoose");
const Book = require("./models/book");
const Author = require("./models/author");

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
  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
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
  },
  Mutation: {
    addBook: async (_, args) => {
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
    editAuthor: async (_, args) => {
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
  },
  Author: {
    bookCount: (root) => {
      return Book.countDocuments({ author: root._id });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
