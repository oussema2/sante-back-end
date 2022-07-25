const Doctor = require("../Schemas/DoctorSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const transporter = require("../mailData/mailData");
var uuid = require("uuid");
const Email = require("email-templates");
const { MailtrapClient } = require("mailtrap");

exports.register = (req, res) => {
  const reqBody = req.body;

  const doctor = new Doctor(reqBody);
  bcrypt.genSalt(15, (err, salt) => {
    bcrypt.hash(doctor.password, salt, (err, hash) => {
      doctor.password = hash;
      doctor.imagePath = req.file.filename;
      console.log(doctor);
      doctor.save((err, doctor) => {
        if (err) {
          console.log(err);
          res.send({
            status: 400,
            message: err,
          });
        } else {
          return res.status(200).send({
            doctor: doctor,
            status: 200,
            message: "ADDED",
          });
        }
      });
    });
  });
};

exports.signIn = (req, res) => {
  Doctor.findOne({ email: req.body.email }, (err, doctor) => {
    if (err) {
      return res.send({
        status: 400,
        message: err,
      });
    }
    if (!doctor) {
      return res.send({
        status: 401,
        message: "Authentification fails , Wrong Email.",
        doctor: doctor,
      });
    }
    if (!doctor || !doctor.comparePassword(req.body.password)) {
      return res.send({
        status: 402,
        message: "Authentification fails , Invalid Password.",
        doctor: doctor,
      });
    }

    res.send({
      token: jwt.sign(
        {
          email: doctor.email,
          namePrename: doctor.namePrename,

          _id: doctor._id,
        },

        "RESTFULAPIs"
      ),
      status: 200,
      doctor: doctor,
    });
  });
};

exports.findDoctor = (req, res) => {
  Doctor.findOne({ _id: req.params._id }, (err, doctor) => {
    if (err) {
      res.send({
        status: 401,
        message: err,
      });
    } else {
      res.send({
        status: 200,
        doctor: doctor,
      });
    }
  });
};

exports.requireLogin = (req, res, next) => {
  if (req.doctor) {
    next();
  } else {
    return res.status(401).send({ message: "Unauthorized user!!" });
  }
};

exports.addPending = (req, res, next) => {
  Doctor.findOne({ _id: req.body._id }, (err, doctor) => {
    if (err) {
      res.status(400).send({
        message: err,
      });
    } else {
      doctor.pendings.push({
        _id: uuid.v4(),
        email: req.body.email,
        namePrename: req.body.namePrename,
        phoneNumber: req.body.phoneNumber,
        Date: new Date(Date.now()).toUTCString(),
      });
      const person = { namePrename: req.body.namePrename };
      doctor.save((err, doc) => {
        if (err) {
          res.status(400).send({
            message: err,
          });
        }
        if (doc) {
          res.send({
            status: 200,
            message: "added",
          });
        }
      });
    }
  });
};

exports.getAllDoctors = (req, res) => {
  Doctor.find((err, doctors) => {
    if (err) {
      res.send({
        status: 400,
        message: err,
      });
    }
    res.status(200).send({
      doctors: doctors,
    });
  });
};

exports.addAppointment = (req, res) => {
  Doctor.findOne({ _id: req.body._id }, (err, doctor) => {
    if (err) {
      res.send({
        status: 400,
        message: err,
      });
    }
    if (!doctor) {
      res.send({
        status: 302,
        message: "user not found !!",
      });
    }
    console.log(doctor);
    const pending = doctor.pendings.filter(
      (item) => item._id === req.body._idPatient
    );
    /*    if (!pending) {
      res.json(303).send({
        message: "patient not found ",
      });
    } else { */
    doctor.appointments.push({
      patient: pending[0],
      date: req.body.dateAppointment,
    });
    doctor.pendings = doctor.pendings.filter(
      (item) => item._id !== req.body._idPatient
    );
    doctor.save((err, doctor) => {
      if (err) {
        res.send({
          status: 400,
          message: err,
        });
      }

      if (doctor) {
        res.send({
          status: 200,
          message: "added",
          doctor: doctor,
        });
      }
    });
    /*  } */
  });
};

exports.getAppointments = (req, res) => {
  const _id = req.params._id;
  Doctor.findOne({ _id: _id }, (err, doctor) => {
    if (err) {
      res.send({
        status: 400,
        message: err,
      });
    }

    res.send({
      status: 200,
      appointments: doctor?.appointments,
    });
  });
};

exports.getPendings = (req, res) => {
  const _id = req.params._id;
  Doctor.findOne({ _id: _id }, (err, doctor) => {
    if (err) {
      res.send({
        status: 400,
        message: err,
      });
    }

    res.send({
      status: 200,
      pendings: doctor.pendings,
    });
  });
};
