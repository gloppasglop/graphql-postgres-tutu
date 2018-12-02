import { gql } from 'apollo-server-express';

const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User

    messages: [Message!]!
    message(id: ID!): Message!

    hosts: [Host!]
    host(id: ID!): Host
    hostByName(name: String!): Host

    groups: [Group!]
    group(id: ID!): Group
  }

  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    updateMessage(id: ID!, text: String!): Message
  }
  type User {
    id: ID!
    username: String!
    messages: [Message]
  }

  type Host {
    id: ID!
    name: String!
    groups: [Group]
    hostvars: [Var]
  }

  type Group {
    id: ID!
    name: String!
    hosts: [Host]
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }

  type Var {
    id: ID!
    name: String!
    value: String
  }
`;

export default schema;
