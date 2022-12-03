const validate = require("../middlewares/validate"); //? validate MiddleWare
const idChecker = require("../middlewares/idChecker");
const authenticate = require("../middlewares/authenticate"); //? authenticate MiddleWare

const schemas = require("../validations/Users"); //? validate schema
const express = require("express");
const UserController = require("../controllers/UserController");
const router = express.Router();

router.get("/", UserController.index);
router
  .route("/")
  .post(validate(schemas.createValidation), UserController.create);
router
  .route("/")
  .patch(
    authenticate,
    validate(schemas.updateValidation),
    UserController.update
  );
router
  .route("/login")
  .post(validate(schemas.loginValidation), UserController.login);
router.route("/projects").get(authenticate, UserController.projectList);
router
  .route("/reset-password")
  .post(
    validate(schemas.resetPasswordValidation),
    UserController.resetPassword
  );
router
  .route("/:id")
  .delete(idChecker(), authenticate, UserController.deleteUser);
router
  .route("/change-password")
  .post(
    authenticate,
    validate(schemas.changePasswordValidation),
    UserController.changePassword
  );
router
  .route("/update-profile-image")
  .post(authenticate, UserController.updateProfileImage);

module.exports = router;
