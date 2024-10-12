import { gql } from 'graphql-tag';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = gql`#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id: ID!
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

type Book = {
  id: string;
  title: string;
  author: string;
};

// Resolvers define the technique for fetching types
export const resolvers = {
  Query: {
    books: (): Book[] => {
      return [
      ];
    },
  },
};