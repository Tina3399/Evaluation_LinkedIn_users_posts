const express = require("express");
const { connection } = require("./configs/db");
const { UserRouter } = require("./routes/User.routes");
const { postRouter } = require("./routes/Post.routes");
const { authenticate } = require("./middlewares/Authenticate.middleware");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
// specifications:

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Swagger in Evaluation",
      version: "1.0.0",
    },
    server: [
      {
        url: "http://localhost:5500",
      },
    ],
  },
  apis: ["./routes/*"],
};

// swagger spec

const swaggerSpec = swaggerJsDoc(options);

// build the UI

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use("/users", UserRouter);
app.use(authenticate);
app.use("/posts", postRouter);
app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log({ msg: "Connection failed", error: error.message });
  }

  console.log(`Listening on port ${process.env.PORT}`);
});
