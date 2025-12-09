const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "dog",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
          isUUID: 4,
          notNull: { msg: "The id field cannot be null " },
        },
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^([a-zA-Z -_]+)$/,
          notNull: { msg: "The name field cannot be null " },
          notEmpty: true,
        },
      },

      height_min: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "The height_min field cannot be null " },
        },
      },

      height_max: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "The height_max field cannot be null " },
        },
      },

      weight_min: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "The weight_min field cannot be null " },
        },
      },

      weight_max: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "The weight_max field cannot be null " },
        },
      },

      years_life: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      image: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
    },
    {
      timestamps: false,
    }
  );
};
