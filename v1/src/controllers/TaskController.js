const httpStatus = require("http-status");

const TaskService = require("../services/TaskService");

class TaskController {
  //? veri ekler
  create(req, res) {
    req.body.user_id = req.user;
    TaskService.create(req.body)
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
    TaskService.list({ project_id: req?.params?.projectId })
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
    TaskService.update(req?.params?.id, req?.body)
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
  deleteTask(req, res) {
    if (!req?.params?.id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: "id is required" });
    }
    TaskService.delete(req.params?.id)
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

  makeComment(req, res) {
    TaskService.findOne({ _id: req?.params?.id })
      .then((mainTasks) => {
        if (!mainTasks) {
          return res.status(httpStatus.NOT_FOUND).send({
            message: "not found task",
          });
        }
        const comment = {
          ...req.body,
          commented_at: new Date(),
          user_id: req.user,
        };
        mainTasks.comments.push(comment);
        mainTasks
          .save()
          .then((updatedDoc) => {
            return res.status(httpStatus.OK).send(updatedDoc);
          })
          .catch(() => {
            res
              .status(httpStatus.INTERNAL_SERVER_ERROR)
              .send({ message: "comment not added 102" });
          });
      })
      .catch(() => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: "comment not added 101" });
      });
  }

  deleteComment(req, res) {
    TaskService.findOne({ _id: req?.params?.id })
      .then((mainTasks) => {
        if (!mainTasks) {
          return res.status(httpStatus.NOT_FOUND).send({
            message: "not found task",
          });
        }

        mainTasks.comments = mainTasks.comments.filter(
          (comment) => comment._id?.toString() != req?.params?.commentId
        );
        mainTasks
          .save()
          .then((updatedDoc) => {
            return res.status(httpStatus.OK).send(updatedDoc);
          })
          .catch(() => {
            res
              .status(httpStatus.INTERNAL_SERVER_ERROR)
              .send({ message: "comment not added 102" });
          });
      })
      .catch(() => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: "comment not added 101" });
      });
  }

  addSubTask(req, res) {
    //!Main Task çekiliyor
    if (!req.params?.id)
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "id is required",
      });
    TaskService.findOne({ _id: req?.params?.id }).then((mainTask) => {
      if (!mainTask)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "not found task" });
      //!Sub Task Create edilir

      TaskService.create({ ...req.body, user_id: req.user })
        .then((subTask) => {
          //!Main Task'a Sub Task referansı eklenir
          mainTask.sub_tasks.push(subTask);
          mainTask
            .save()
            .then((updatedDoc) => {
              //!Kullanıcıya yeni data gönderilir
              res.status(httpStatus.OK).send(updatedDoc);
            })
            .catch(() => {
              res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .send({ message: "not added" });
            });
        })
        .catch(() => {
          res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send({ message: "sub task not created" });
        });
    });
  }

  fetchTask(req, res) {
    if (!req?.params?.id)
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "id is required" });
    TaskService.findOne({ _id: req?.params?.id })
      .then((task) => {
        if (!task)
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "not found task" });
        res.status(httpStatus.OK).send(task);
      })
      .catch(() => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: "not found task" });
      });
  }
}

module.exports = new TaskController();
