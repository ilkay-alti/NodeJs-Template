//? validate MiddleWare
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const idChecker = require("../middlewares/idChecker");

//? validate schema
const schemas = require("../validations/Tasks");
const express = require("express");
const TaskController = require("../controllers/TaskController");
const router = express.Router();

router
  .route("/")
  .post(
    authenticate,
    validate(schemas.createValidation),
    TaskController.create
  );

router
  .route("/:id")
  .patch(
    idChecker(),
    authenticate,
    validate(schemas.updateValidation),
    TaskController.update
  );

router.route("/:id").delete(idChecker, authenticate, TaskController.deleteTask);

router
  .route("/:id/make-comment")
  .post(
    idChecker(),
    authenticate,
    validate(schemas.commentValidation),
    TaskController.makeComment
  );

router
  .route("/:id/:commentId")
  .delete(idChecker(), authenticate, TaskController.deleteComment);

router
  .route("/:id/add-sub-task")
  .post(
    idChecker(),
    authenticate,
    validate(schemas.updateValidation),
    TaskController.addSubTask
  );

router.route("/:id").get(idChecker(), authenticate, TaskController.fetchTask);

router.route("/").get(authenticate, TaskController.index);
module.exports = router;
