// const Project = require("../models/Projects");
// //? veri ekleniyor
// const insert = (data) => {
//   const project = new Project(data);
//   return project.save();
// };

// //? user ıd kulanarak fulname ve email ı cekıyoruz
// const list = (where) => {
//   return Project.find(where || {}).populate({
//     path: "user_id",
//     select: "full_name email profile_image",
//   });
// };

// //? id ye gore guncelleme yapılıyor
// const modify = (id, data) => {
//   return Project.findByIdAndUpdate(id, data, { new: true });
//   // return Project.findById(id).then((project) => {
//   //   project.name = data?.name;
//   //   return project.save();
//   // });
// };

// const remove = (id) => {
//   return Project.findByIdAndDelete(id, { new: true });
// };
// module.exports = {
//   insert,
//   list,
//   modify,
//   remove,
// };

const BaseService = require("./BaseService");
const BaseModel = require("../models/Projects");
class ProjectService extends BaseService {
  constructor() {
    super(BaseModel);
  }

  list(where) {
    return BaseModel?.find(where || {}).populate({
      path: "user_id",
      select: "full_name email profile_image",
    });
  }
}

module.exports = new ProjectService();
