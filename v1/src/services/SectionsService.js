// const Section = require("../models/Sections");
// //? veri ekleniyor
// const insert = (data) => {
//   const section = new Section(data);
//   return section.save();
// };

// //? user ıd kulanarak selectekı alanları cekıyoruz
// const list = (where) => {
//   return Section.find(where || {})
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
//   return Section.findByIdAndUpdate(id, data, { new: true });
//   // return Section.findById(id).then((project) => {
//   //   project.name = data?.name;
//   //   return project.save();
//   // });
// };

// const remove = (id) => {
//   return Section.findByIdAndDelete(id, { new: true });
// };
// module.exports = {
//   insert,
//   list,
//   modify,
//   remove,
// };

const BaseService = require("./BaseService");
const BaseModel = require("../models/Sections");
class SectionService extends BaseService {
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
}
module.exports = new SectionService();
