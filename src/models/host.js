const host = (sequelize, DataTypes) => {
  const Host = sequelize.define('host', {
    name: {
      type: DataTypes.STRING,
      validate: { notEmpty: true },
      unique: true,
    },
  });

  Host.associate = (models) => {
    Host.belongsToMany(models.Group, {
      through: models.GroupHost,
    });
    Host.hasMany(models.Hostvar, { onDelete: 'CASCADE' });
  };

  return Host;
};

export default host;
