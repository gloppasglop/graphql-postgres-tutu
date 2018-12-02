import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { isAdmin, isAuthenticated } from './authorization';

const resolvers = {
  Query: {
    me: (parent, args, { me }) => me,
    user: async (parent, { id }, { models }) => models.User.findById(id),
    users: async (parent, args, { models }) => models.User.findAll(),
    messages: async (parent, args, { models }) => models.Message.findAll(),
    message: async (parent, { id }, { models }) => models.Message.findById(id),
    host: async (parent, { id }, { models }) => models.Host.findById(id),
    hostByName: async (parent, { name }, { models }) => models.Host.findOne({
      where: {
        name,
      },
    }),
    hosts: async (parent, args, { models }) => models.Host.findAll(),
    group: async (parent, { id }, { models }) => models.Group.findById(id),
    groups: async (parent, args, { models }) => models.Group.findAll(),
  },

  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      };

      messages[id] = message;
      return message;
    },
    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;
      if (!message) {
        return false;
      }
      messages = otherMessages;
      return true;
    },
    updateMessage: (parent, { id, text }) => {
      const message = messages[id];
      if (!message) {
        return null;
      }
      const updatedMessage = { ...message, text };
      console.log(updatedMessage);
      messages[id] = updatedMessage;
      return updatedMessage;
    },
  },
  User: {
    messages: async (user, args, { models }) => models.Message.findAll({
      where: {
        userId: user.id,
      },
    }),
  },

  Message: {
    user: async (message, args, { models }) => models.User.findById(message.userId),
  },

  Host: {
    groups: async (host, args, { models }) => host.getGroups(),
    hostvars: async (host, args, { models }) => host.getHostvars(),
  },

  Var: {
    name: (hostvar, args, { models }) => hostvar.name.replace(/ /g,'_'),
  },

  Group: {
    hosts: async (group, args, { models }) => group.getHosts(),
  },
};


export default resolvers;
