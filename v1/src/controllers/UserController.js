const httpStatus = require("http-status");
const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/helper");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");

const path = require("path");

const UserService = require("../services/UserService");
const ProjectService = require("../services/ProjectService");

class UserController {
  //? veri ekler
  create(req, res) {
    req.body.password = passwordToHash(req.body.password);
    UserService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((error) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
      });
  }
  //? login kontrol
  login(req, res) {
    req.body.password = passwordToHash(req.body.password);
    UserService.findOne(req.body)
      .then((user) => {
        if (!user)
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "User not found" });
        user = {
          ...user._doc,
          tokens: {
            access_token: generateAccessToken(user),
            refresh_token: generateRefreshToken(user),
          },
        };
        delete user.password;
        res.status(httpStatus.OK).send(user);
      })
      .catch((error) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error)
      );
  }

  //? butun verileri listeler
  index(req, res) {
    UserService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }

  //? user ıd ye gore verileri listeler
  projectList(req, res) {
    ProjectService.list({ user_id: req.user?._id })
      .then((projects) => {
        res.status(httpStatus.OK).send(projects);
      })
      .catch(() => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR.send)({
          error: "error fetching projects",
        });
      });
  }

  //? password sıfırlama
  resetPassword(req, res) {
    const new_password =
      uuid.v4()?.split("-")?.[0] || `usr-${new Date().getTime()}`;
    UserService.updateWhere(
      { email: req.body.email },
      { password: passwordToHash(new_password) }
    )
      .then((updatedUsers) => {
        if (!updatedUsers)
          //? emaile gore kayıtlı kullanıcı yoksa
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "User not found" });

        eventEmitter.emit("send_email", {
          to: updatedUsers.email,
          subject: "Password Reset",
          html: `<h1>New App Password: ${new_password}</h1>`,
        });
        res.status(httpStatus.OK).send({
          message: "Password reset successfully",
        });
      })
      .catch(() => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "user password not updated" });
      });
  }

  //? user verilerini gunceller
  update(req, res) {
    UserService.update(req.user?._id, req.body)
      .then((updatedUsers) => {
        res
          .status(httpStatus.OK)
          .send({ message: "user updated", updatedUsers });
      })
      .catch(() => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "user not updated" });
      });
  }

  //? verileri siler
  deleteUser(req, res) {
    if (!req?.params?.id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "id is required" });
    }
    UserService.delete(req.params?.id)
      .then((deletedUsers) => {
        if (!deletedUsers) {
          return res.status(httpStatus.NOT_FOUND).send({
            message: "not found",
          });
        }
        res
          .status(httpStatus.OK)
          .send({ deletedData: deletedUsers, message: "User deleted" });
      })
      .catch(() => {
        res.status(httpStatus.INTERVAL_SERVER_ERROR).send({
          error: "User not deleted",
        });
      });
  }

  changePassword(req, res) {
    req.body.password = passwordToHash(req.body.password);
    UserService.update(req.user?._id, req.body)
      .then((updatedUsers) => {
        res
          .status(httpStatus.OK)
          .send({ message: "password changed", updatedUsers });
      })
      .catch(() => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "password not changed",
        });
      });
  }

  updateProfileImage(req, res) {
    if (!req?.files?.profile_image) {
      return res.status(httpStatus.BAD_REQUEST).send({
        error: "profile image is required",
      });
    }
    const extension = path.extname(req.files.profile_image.name);
    const fileName = `${req.user?._id}${extension}`;
    const folderPath = path.join(__dirname, "..", "uploads/users", fileName);
    req.files.profile_image.mv(
      folderPath,

      (error) => {
        if (error) {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            error: "profile image not uploaded",
            error_found: error,
          });
        }
        UserService.update(req.user?._id, { profile_image: fileName })
          .then((updatedUsers) => {
            res.status(httpStatus.OK).send({
              message: "profile image updated",
              updatedUsers,
            });
          })
          .catch(() => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
              error: "profile image not updated",
            });
          });
      }
    );
  }
}

module.exports = new UserController();
