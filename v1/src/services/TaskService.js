// const Task = require("../models/Tasks");
// //? veri ekleniyor
// const insert = (data) => {
//   const task = new Task(data);
//   return task.save();
// };

// //? user ıd kulanarak selectekı alanları cekıyoruz
// const list = (where) => {
//   return Task.find(where || {})
//     .populate({
//       path: "user_id",
//       select: "full_name email profile_image",
//     })
//     .populate({
//       path: "project_id",
//       select: "name",
//     });
// };

// //? id ye gore guncelleme yapılıyor
// const modify = (id, data) => {
//   return Task.findByIdAndUpdate(id, data, { new: true });
//   // return Task.findById(id).then((project) => {
//   //   project.name = data?.name;
//   //   return project.save();
//   // });
// };

// const remove = (id) => {
//   return Task.findByIdAndDelete(id, { new: true });
// };

// const findOne = (where, expand) => {
//   if (!expand) return Task.findOne(where);
//   return Task.findOne(where).populate({
//     path: "user_id",
//     select: "full_name email profile_image",
//   });
// };

// module.exports = {
//   insert,
//   list,
//   modify,
//   remove,
//   findOne,
// };

const BaseService = require("./BaseService");
const BaseModel = require("../models/Tasks");
class TaskService extends BaseService {
  constructor() {
    super(BaseModel);
  }

  list = (where) => {
    return BaseModel.find(where || {})
      .populate({
        path: "user_id",
        select: "full_name email profile_image",
      })
      .populate({
        path: "project_id",
        select: "name",
      });
  };

  findOne = (where, expand) => {
    if (!expand) return BaseModel.findOne(where);
    return this.BaseModel.findOne(where).populate(
      {
        path: "user_id",
        select: "full_name email profile_image",
      },
      {
        path: "comments",
        select: "full_name email profile_image",
      },
      {
        path: "sub_tasks",
        select: "title, description,isCompleted,createdAt,updatedAt",
      }
    );
  };
}
module.exports = new TaskService();
