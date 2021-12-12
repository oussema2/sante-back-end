const doctorRouter = require("express").Router();
const DoctorController = require("../Controller/DoctorController");
const JWTChecker = require("../Controller/JWTController");
const imageUpload = require("../multer/fileUpload").uploadFile;
doctorRouter
  .route("/auth/register")
  .post(imageUpload.single("imagePath"), DoctorController.register);
doctorRouter.route("/auth/signin").post(DoctorController.signIn);
doctorRouter.route("/getAll").get(DoctorController.getAllDoctors);
doctorRouter.route("/addPending").post(DoctorController.addPending);
doctorRouter.route("/addAppointment").post(DoctorController.addAppointment);
doctorRouter.route("/getDoctor/:_id").get(DoctorController.findDoctor);
doctorRouter
  .route("/getAppointments/:_id")
  .get(DoctorController.getAppointments);
doctorRouter.route("/getPendings/:_id").get(DoctorController.getPendings);
module.exports = doctorRouter;
