import uuidv4 from 'uuid/v4';
import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import createUsersWithMessages from './seeders';
import seeders from './seeders';


const app = express();

app.use(cors());

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

const eraseDatabaseOnSync = false;
const seedOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (seedOnSync) {
    seeders.forEach((seeder) => {
      seeder(models);
    });
  }

  app.listen({ port: 8080 }, () => {
    console.log('Apollo server');
  });
});
