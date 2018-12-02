const group = (sequelize, DataTypes) => {
  const Group = sequelize.define('group', {
    name: {
      type: DataTypes.STRING,
      validate: { notEmpty: true },
    },
  });

  Group.associate = (models) => {
    Group.belongsToMany(models.Host, {
      through: models.GroupHost,
    });
  };

  return Group;
};

export default group;
