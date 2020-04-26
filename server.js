const express = require("express");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const _USERS = require("./users.json");

const app = express();
const port = 8001;

const connection = new Sequelize("db", "user", "pass", {
  host: "localhost",
  dialect: "sqlite",
  storage: "db.sqlite",
  operatorsAliases: false,
  define: {
    freezeTableName: true,
  },
});

const User = connection.define("User", {
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      isAlphanumeric: true,
    },
  },
});

const Post = connection.define("Post", {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  title: Sequelize.STRING,
  content: Sequelize.TEXT,
});

app.get("/allposts", (req, res) => {
  Post.findAll({
    include: [
      {
        model: User,
        as: "UserRef",
      },
    ],
  })
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

Post.belongsTo(User, { as: "UserRef", foreignKey: "userId" });

connection
  .sync({
    force: true,
    // logging: console.log,
  })
  .then(() => {
    User.bulkCreate(_USERS)
      .then((user) => {
        console.log("Succes adding users");
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .then(() => {
    Post.create({
      userId: 1,
      title: "Final post",
      content: "post content 1",
    });
  })

  .then(() => {
    console.log("Connection to database established successfully");
  });

app.listen(port, () => {
  console.log("Running server on port " + port);
});
