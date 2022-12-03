const express = require("express");
const fileupload = require("express-fileupload");
const helmet = require("helmet");
const config = require("./config");
const {
  ProjectRoutes,
  UserRoutes,
  SectionRoutes,
  TaskRoutes,
} = require("./api-routes");
const loaders = require("./loaders");
const events = require("./scripts/events");
const path = require("path");
const BaseService = require("./services/BaseService");
const { error } = require("console");
const errorHandler = require("./middlewares/errorHandler");
config();
loaders();
events();

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "./", "uploads")));
app.use(express.json());
app.use(helmet());
app.use(fileupload());

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
  app.use("/projects", ProjectRoutes);
  app.use("/users", UserRoutes);
  app.use("/sections", SectionRoutes);
  app.use("/tasks", TaskRoutes);
  app.use((req, res, next) => {
    const error = new Error("Not Url Found");
    error.status = 404;
    next(error);
  });

  app.use(errorHandler);
});
