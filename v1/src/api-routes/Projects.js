//? validate MiddleWare
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const idChecker = require("../middlewares/idChecker");
//? validate schema
const schemas = require("../validations/Projects");
const express = require("express");
const ProjectController = require("../controllers/ProjectController");
const router = express.Router();

router.route("/").get(authenticate, ProjectController.index);
router
  .route("/")
  .post(
    authenticate,
    validate(schemas.createValidation),
    ProjectController.create
  );
router
  .route("/:id")
  .patch(
    idChecker(),
    authenticate,
    validate(schemas.updateValidation),
    ProjectController.update
  );

router
  .route("/:id")
  .delete(idChecker(), authenticate, ProjectController.deleteProject);

module.exports = router;
