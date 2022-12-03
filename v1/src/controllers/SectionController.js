const httpStatus = require("http-status");
const SectionService = require("../services/SectionsService");

class SectionController {
  //? veri ekler
  create(req, res) {
    req.body.user_id = req.user;
    SectionService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((error) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
      });
  }
  //? butun verileri listeler
  index(req, res) {
    if (!req?.params?.projectId)
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "projectId is required" });
    SectionService.list({ project_id: req?.params?.projectId })
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  }

  //? verileri günceller
  update(req, res) {
    if (!req?.params?.id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "id is required" }); //? req.params.id yoksa
    }
    SectionService.update(req?.params?.id, req?.body)
      .then((updatedDoc) => {
        res.status(httpStatus.OK).send({ updatedDoc, message: "updated" });
      })
      .catch(() => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: "dont updated" });
      });
  }

  //? verileri siler
  deleteSection(req, res) {
    if (!req?.params?.id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "id is required" });
    }
    SectionService.delete(req.params?.id)
      .then((deleteDoc) => {
        if (!deleteDoc) {
          return res.status(httpStatus.NOT_FOUND).send({
            message: "not found",
          });
        }
        res
          .status(httpStatus.OK)
          .send({ deletedData: deleteDoc, message: "Section deleted" });
      })
      .catch(() => {
        res.status(httpStatus.INTERVAL_SERVER_ERROR).send({
          error: "Section not deleted",
        });
      });
  }
}

module.exports = new SectionController();
