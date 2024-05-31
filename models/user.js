const mongoose = require("mongoose");
const { Password } = require("../services/password");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    played: {
      type: Number,
      default: 0,
      min: 0,
    },
    won: {
      type: Number,
      default: 0,
      min: 0,
    },
    jackpot: {
      type: Number,
      default: 0,
      min: 0,
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamp: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

UserSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

UserSchema.statics.build = (attrs) => {
  return new User(attrs);
};

const User = mongoose.model("User", UserSchema);

module.exports = { User };
