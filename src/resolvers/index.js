import { urlencoded } from "body-parser";

const resolvers = {
  Query: {
    me: (parent, args, { me }) => me,
    user: async (parent, { id }, { models }) => models.User.findById(id),
    users: async (parent, args, { models }) => models.User.findAll(),
    messages: async (parent, args, { models }) => models.Message.findAll(),
    message: async (parent, { id }, { models }) => models.Message.findById(id),
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
};


export default resolvers;
