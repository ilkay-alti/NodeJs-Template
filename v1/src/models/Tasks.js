const Mongoose = require("mongoose");
const logger = require("../scripts/logger/Tasks");

const TaskSchema = new Mongoose.Schema(
  {
    title: String,
    description: String,
    assignedTo: {
      type: Mongoose.Types.ObjectId,
      ref: "user",
    },
    due_date: Date,
    statuses: [String],

    user_id: {
      type: Mongoose.Types.ObjectId,
      ref: "user",
    },
    project_id: {
      type: Mongoose.Types.ObjectId,
      ref: "project",
    },
    section_id: {
      type: Mongoose.Types.ObjectId,
      ref: "section",
    },
    order: Number,
    isComplated: Boolean,
    comments: [
      {
        comment: String,
        comment_at: Date,
        user_id: {
          type: Mongoose.Types.ObjectId,
          ref: "user",
        },
      },
    ],
    media: [String],
    sub_tasks: [
      {
        type: Mongoose.Types.ObjectId,
        ref: "task",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

//? Request oncesınde calsıırı
// ProjectSchema.pre("save", (next, doc) => {
//   console.log("Oncesi", doc);
//   next();
// });

//? Request sonrasında calsıır
TaskSchema.post("save", (doc) => {
  logger.log({
    level: "info",
    message: doc,
  });
});
module.exports = Mongoose.model("task", TaskSchema);
