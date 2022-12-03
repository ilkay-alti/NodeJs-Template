const httpStatus = require("http-status");
const ProjectService = require("../services/ProjectService");
const ApiError = require("../errors/ApiError");
class ProjectController {
  //? veri ekler
  create(req, res) {
    req.body.user_id = req.user;
    ProjectService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((error) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
      });
  }
  //? butun verileri listeler
  index(req, res) {
    ProjectService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }

  //? verileri günceller
  update(req, res, next) {
    if (!req?.params?.id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "id is required" }); //? req.params.id yoksa
    }
    ProjectService.update(req?.params?.id, req?.body)
      .then((updatedDoc) => {
        if (!updatedDoc)
          return next(new ApiError("BoyleBişeyyokk", httpStatus.NOT_FOUND));

        res.status(httpStatus.OK).send({ updatedDoc, message: "updated" });
      })
      .catch((e) => next(new ApiError(e?.message)));
  }

  //? verileri siler
  deleteProject(req, res) {
    if (!req?.params?.id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "id is required" });
    }
    ProjectService.delete(req.params?.id)
      .then((deletedDoc) => {
        if (!deletedDoc) {
          return res.status(httpStatus.NOT_FOUND).send({
            message: "not found",
          });
        }
        res
          .status(httpStatus.OK)
          .send({ deletedData: deletedDoc, message: "Project deleted" });
      })
      .catch(() => {
        res.status(httpStatus.INTERVAL_SERVER_ERROR).send({
          error: "Project not deleted",
        });
      });
  }
}
module.exports = new ProjectController();
