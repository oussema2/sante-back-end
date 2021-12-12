const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const DoctorSchema = new Schema({
  email: {
    unique: true,
    trim: true,
    type: String,
    required: true,
  },
  namePrename: {
    trim: true,
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  adress: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  specialisation: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
  pendings: {
    type: Array,
    default: [],
  },
  appointments: {
    type: Array,
    default: [],
  },
});

DoctorSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Doctor = mongoose.model("Doctor", DoctorSchema);
module.exports = Doctor;
