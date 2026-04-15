module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return Question;
};