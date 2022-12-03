// const User = require("../models/Users");

// //? yeni user ekler
// const insert = (data) => {
//   const user = new User(data);
//   return user.save();
// };

// //? login data ile giriş yapar
// const loginUser = (logindata) => {
//   return User.findOne({ email: logindata.email, password: logindata.password });
// };

// //? butun userları listeler
// const list = () => {
//   return User.find({});
// };

// //? epostaya gore kulanıcıyı bulur
// const modify = (where, data) => {
//   return User.findOneAndUpdate(where, data, { new: true });
// };

// //? user ıd ye gore user siler
// const remove = (id) => {
//   return User.findByIdAndDelete(id, { new: true });
// };
// module.exports = {
//   insert,
//   list,
//   loginUser,
//   modify,
//   remove,
// };
const BaseService = require("./BaseService");
const BaseModel = require("../models/Users");
class UserService extends BaseService {
  constructor() {
    super(BaseModel);
  }
}
module.exports = new UserService();
