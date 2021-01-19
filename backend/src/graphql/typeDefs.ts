// IMPORTS
// ------------------------------------------------------------
import { gql } from 'apollo-server-express';

// TYPE DEFINITIONS
// ------------------------------------------------------------
const typeDefs = gql`
    # Scalars
    scalar Upload

    # Types
    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }

    # Queries
    type Query {
        health: String!
    }

    # Mutations
    type Mutation {
        singleUpload(file: Upload!): File!,
        multiUpload(files: [Upload]!): [File]!,
        singleUploadStream(file: Upload!): File!
    }
`;

// EXPORTS
// ------------------------------------------------------------
export default typeDefs;