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

  /* 
    uuid: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    first: Sequelize.STRING,
    last: Sequelize.STRING,
    full_name: Sequelize.STRING,
    bio: Sequelize.TEXT,
  },
  {
    hooks: {
      beforeValidate: () => {
        console.log("Before validate");
      },
      afterValidate: () => {
        console.log("after validate");
      },
      beforeCreate: (user) => {
        user.full_name = `${user.first} ${user.last}`;
        console.log("before Create");
      },
      afterCreate: () => {
        console.log("after Create");
      },
    }, */
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

// app.get("/findall", (req, res) => {
//   User.findAll({
//     where: {
//       name: { [Op.like]: "De%" },
//     },
//   })
//     .then((user) => {
//       res.json(user);
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(404).send(error);
//     });
// });

app.get("/allposts", (req, res) => {
  Post.findAll({
    include: [User],
  })
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send(error);
    });
});

Post.belongsTo(User);

// app.get("/findOne", (req, res) => {
//   User.findByPk("55")
//     .then((user) => {
//       res.json(user);
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(404).send(error);
//     });
// });

// app.delete("/remove", (req, res) => {
//   User.destroy({
//     where: { id: 50 },
//   })
//     .then(() => {
//       res.send("user successfully deleted");
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(404).send(error);
//     });
// });

// app.put("/update", (req, res) => {
//   User.update(
//     { name: "Michael Keaton", password: "password" },
//     { where: { id: 55 } }
//   )
//     .then((rows) => {
//       res.json(rows);
//       console.log();
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(404).send(error);
//     });
// });

// app.post("/post", (req, res) => {
//   const newUser = req.body.user;
//   User.create({
//     name: newUser.name,
//     email: newUser.email,
//   });
// });

connection
  .sync({
    // force: true,
    // logging: console.log,
  })
  .then(() => {
    // User.bulkCreate(
    //   _USERS
    Post.create({
      UserId: 1,
      title: "Final post",
      content: "post content 1",
    });

    //   )
    //     .then((users) => {
    //       console.log("Success adding users");
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
  })
  .then(() => {
    console.log("Connection to database established successfully");
  });

app.listen(port, () => {
  console.log("Running server on port " + port);
});
