module.exports = {
    host: "localhost",
    user: "root",
    password: "Orange2023@BROWN",
    database: 'ecolecamerdb',
    multipleStatements: true,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };