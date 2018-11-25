import uuidv4 from 'uuid/v4';
import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';


const app = express();

app.use(cors());

let users = {
  1: {
    id: '1',
    username: 'Christophe Roux',
  },
  2: {
    id: '2',
    username: 'Another User',
  },
};

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2',
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: models.User.findOne({
      where: {
        username: 'rwieruch',
      },
    }),
    models,
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'rwieruch',
      messages: [
        {
          text: 'Published the Road to learn React',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      username: 'ddavids',
      messages: [
        {
          text: 'Happy to release ...',
        },
        {
          text: 'Published a complete ...',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }

app.listen({ port: 3000 }, () => {
    console.log('Apollo server');
  });
});
