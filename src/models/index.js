import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
  },
);


const User = sequelize.define('user', {
  username: Sequelize.STRING,
});

const Message = sequelize.define('message', {
  text: Sequelize.STRING,
});

User.hasMany(Message, { onDelete: 'CASCADE' });
Message.belongsTo(User);

const models = {
  User,
  Message,
};

export { sequelize };
export default models;
