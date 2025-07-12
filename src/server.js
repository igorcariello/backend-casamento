require("express-async-errors");
require("dotenv").config();

const checkEnvVariables = require("./configs/envValidation");
checkEnvVariables();

const express = require("express");
const cors = require("cors");
const { errors: celebrateErrors } = require("celebrate");
const routes = require("./routes");
const AppError = require("./utils/AppError");

const app = express();

// em desenvolvimento
//app.use(cors({
//  origin: ["http://localhost:5173", "http://localhost:3000"],
//}));

app.use(
  cors({
    origin: "https://beatrizeiago.netlify.app/",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());

app.use(routes);

app.use(celebrateErrors());

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 3334;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}!`));
