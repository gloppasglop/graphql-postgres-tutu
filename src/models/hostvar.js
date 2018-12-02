const hostvar = (sequelize, DataTypes) => {
  const Hostvar = sequelize.define('hostvar', {
    name: {
      type: DataTypes.STRING,
      validate: { notEmpty: true },
      unique: 'uniqueName',
    },
    hostId: {
      type: DataTypes.INTEGER,
      unique: 'uniqueName',
      validate: { notEmpty: true },
    },
    value: {
      type: DataTypes.STRING,
    },
    source: {
      type: DataTypes.STRING,
      validate: { notEmpty: true },
      unique: 'uniqueName',
    },
  });

  return Hostvar;
};

export default hostvar;
