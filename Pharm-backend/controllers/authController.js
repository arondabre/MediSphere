const { validationResult } = require("express-validator");
const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Account = require("../models/account");
const Seller = require("../models/seller");
const E_data = require("../models/E_data");
const Booking = require("../models/booking");

const Doctor = require("../models/doctor");


const postmark = require("postmark");
const cloudinary = require("../util/cloudinary");
const { Router } = require("express");






const client = new postmark.ServerClient("2a5656d7-db36-400a-83d6-061c0b86edde");

//const transporter = nodemailer.createTransport(Glen 
  //sendgridTransport({
    //auth: {
      //api_key: process.env.email_KEY,
    //},
  //})
//);

exports.signupUser = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed, Incorrect data entered.");
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const email = req.body.email;
  const firstName = req.body.firstName;
  const password = req.body.password;
  const lastName = req.body.lastName;
  const role = req.body.role;
  let token;

  if (role !== "ROLE_USER") {
    const error = new Error(
      "Signing up an user should have a role of ROLE_USER"
    );
    error.statusCode = 500;
    throw error;
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      token = crypto.randomBytes(32).toString("hex");

      const account = new Account({
        role: role,
        email: email,
        password: hashedPassword,
        accountVerifyToken: token,
        accountVerifyTokenExpiration: Date.now() + 3600000,
      });
      return account.save();
    })
    .then((savedAccount) => {
      const user = new User({
        firstName: firstName,
        lastName: lastName,
        account: savedAccount,
      });
      return user.save();
    })
  
    .then((savedUser) => {

      //client.sendEmail({
        //"From": "jbbm8185@student.sfit.ac.in",
        //"To": email,
        //"Subject": "Verify your Account on E-PHARM",
        //"TextBody": "Please verify your email by clicking on the link below - FoodHub Click this <a href="http://localhost:3002/auth/verify/${token}">link</a> to verify your account. ",
     // });
      client.sendEmail({
        "to": email,
        "from": "aronagnel@student.sfit.ac.in",
        "subject": "Verify your Account on E-Pharm",
        "HtmlBody": `
                      <p>Please verify your email by clicking on the link below - E-Pharm</p>
                      <p>Click this <a href="http://localhost:3002/auth/verify/${token}">link</a> to verify your account.</p>
                    `,
      });
      res.status(201).json({
        message:
          "User signed-up successfully, please verify your email before logging in.",
        userId: savedUser._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.verifyAccount = (req, res, next) => {
  const token = req.params.token;
  Account.findOne({
    accountVerifyToken: token,
    accountVerifyTokenExpiration: { $gt: Date.now() },
  })
    .then((account) => {
      if (!account) {
        const error = new Error(
          "Token in the url is tempered, don't try to fool me!"
        );
        error.statusCode = 403;
        throw error;
      }
      account.isVerified = true;
      account.accountVerifyToken = undefined;
      account.accountVerifyTokenExpiration = undefined;
      return account.save();
    })
    .then((account) => {
      res.json({ message: "Account verified successfully." });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  Account.findOne({ email: email })
    .then((account) => {
      if (!account) {
        const error = new Error("Invalid email/password combination.");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = account;
      return bcrypt.compare(password, account.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Invalid email/password combination.");
        error.statusCode = 401;
        throw error;
      }
      if (loadedUser.isVerified === false) {
        const error = new Error(
          "Verify your email before accessing the platform."
        );
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        { accountId: loadedUser._id.toString() },
        "supersecretkey-foodWebApp",
        { expiresIn: "10h" }
      );
      res.status(200).json({ message: "Logged-in successfully", token: token });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.signupSeller = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed, Incorrect data entered.");
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  if (req.files.length == 0) {
    const error = new Error("Upload an image as well.");
    error.statusCode = 422;
    throw error;
  }

  const arrayFiles = req.files.map((file) => file.path);
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const tags = req.body.tags;
  const role = req.body.role;
  const payment = req.body.payment;
  const paymentArray = payment.split(" ");
  const phoneNo = req.body.phoneNo;
  const street = req.body.street;
  const aptName = req.body.aptName;
  const formattedAddress = req.body.formattedAddress;
  const lat = req.body.lat;
  const lng = req.body.lng;
  const locality = req.body.locality;
  const zip = req.body.zip;

  let token;

  if (role !== "ROLE_SELLER") {
    const error = new Error(
      "Signing up a seller should have a role of ROLE_SELLER"
    );
    error.statusCode = 500;
    throw error;
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      token = crypto.randomBytes(32).toString("hex");

      const account = new Account({
        role: role,
        email: email,
        password: hashedPassword,
        accountVerifyToken: token,
        accountVerifyTokenExpiration: Date.now() + 3600000,
      });
      return account.save();
    })
    .then((savedAccount) => {
      const seller = new Seller({
        name: name,
        tags: tags,
        email: email,
        imageUrl: arrayFiles,
        account: savedAccount,
        payment: paymentArray,
        formattedAddress: formattedAddress,
        address: {
          street: street,
          zip: zip,
          phoneNo: phoneNo,
          locality: locality,
          aptName: aptName,
          lat: lat,
          lng: lng,
        },
      });
      return seller.save();
    })


    //transporter.sendMail({
    //  to: email,
    //  from: "jbbm8185@student.sfit.ac.in",
    //  subject: "Verify your Account on E-PHARM",
    //  Html: `
    //                <p>Please verify your email by clicking on the link below - FoodHub</p>
    //                <p>Click this <a href="http://localhost:3002/auth/verify/${token}">link</a> to verify your account.</p>
    //              `,
    //});



    .then((savedSeller) => {
      client.sendEmail({
        "to": email,
        "from": "aronagnel@student.sfit.ac.in",
        "subject": "Verify your Account on E-PHARM",
        "HtmlBody": `
                      <p>Please verify your email by clicking on the link below - Pharmacy</p>
                      <p>Click this <a href="http://localhost:3002/auth/verify/${token}">link</a> to verify your account.</p>
                    `,
      });
      res.status(201).json({
        message:
          "Seller signed-up successfully, please verify your email before logging in.",
        sellerId: savedSeller._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.imagesTest = (req, res, next) => {
  if (!req.files) {
    const error = new Error("Upload an image as well.");
    error.statusCode = 422;
    throw error;
  }

  const arrayFiles = req.files.map((file) => file.path);
  console.log(arrayFiles);

  res.status(200).json({ message: "success" });
};


// precsription
exports.Prescription = async (req, res, next) => {

  const name = req.body.Doc;
  const image = req.body.img;
  const email = req.body.Email;
  const cusName = req.body.Yname;
  const Apt   = req.body.Aptname;
  const Local = req.body.Local;
  const street = req.body.street;
  const Zip = req.body.Zip;
  const Phone =req.body.Phone;


  

  
  try{
    const result = await cloudinary.uploader.upload(image,{

      folder: "precriptions",
      width: 300,
      crop:"scale"
      
    
    })

    //const email= await  Account.find({email:"frisanjohn@student.sfit.ac.in"})
    console.log(email)

    client.sendEmail({
      "to": email,
      "from": "aronagnel@student.sfit.ac.in",
      "subject": "Precription",
      "HtmlBody": `
                   <h1>Name of Doctor : ${name} </h1>
                   <h3>Customer Name: ${cusName}</h3>
                   
                   <h2>Adress</h2>
                   Apartment: ${Apt}<br>
                   Local : ${Local}<br>
                   Street :${street}<br>
                   zip :${Zip}<br>
                   Pnone_No. :${Phone}<br>
                   

                  <p>Please check this precription </p>
                  <p>Click this <a href=${result.secure_url}>link</a> for preciption.</p>
                  `,
    });
    res.status(201).json({
      message:
        "Precription Uploaded",
      //sellerId: savedSeller._id,
    });

   
  }catch(error){
    console.log(error);
    next(error);
  }
  
      

};

// extracted data

exports.Extract = async (req, res, next) => {


  const BOD = req.body.Year;
  const Gender = req.body.Gender;
  const Adhar_number = req.body.Adhar_number;
  const indian = req.body.Country;

 
  

  const e_data = new E_data({
    Year: BOD,
    Gender:Gender,
    Adhar_Number:Adhar_number,
    Country:indian,
  });
  return e_data.save();
   
  
      

};

exports.signupDoctor = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed, Incorrect data entered.");
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  if (req.files.length == 0) {
    const error = new Error("Upload an image as well.");
    error.statusCode = 422;
    throw error;
  }

  const arrayFiles = req.files.map((file) => file.path);
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const tags = req.body.tags;
  const role = req.body.role;
  const payment = req.body.payment;
  const paymentArray = payment.split(" ");
  const phoneNo = req.body.phoneNo;
  const street = req.body.street;
  const aptName = req.body.aptName;
  const formattedAddress = req.body.formattedAddress;
  const lat = req.body.lat;
  const lng = req.body.lng;
  const locality = req.body.locality;
  const zip = req.body.zip;
  const time = req.body.time;
  const Fees = req.body.Fees;

  let token;

  if (role !== "ROLE_DOCTOR") {
    const error = new Error(
      "Signing up a seller should have a role of ROLE_Doctor"
    );
    error.statusCode = 500;
    throw error;
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      token = crypto.randomBytes(32).toString("hex");

      const account = new Account({
        role: role,
        email: email,
        password: hashedPassword,
        accountVerifyToken: token,
        accountVerifyTokenExpiration: Date.now() + 3600000,
      });
      return account.save();
    })
    .then((savedAccount) => {
      const doctor = new Doctor({
        name: name,
        tags: tags,
        email: email,
        imageUrl: arrayFiles,
        account: savedAccount,
        payment: paymentArray,
        formattedAddress: formattedAddress,
        address: {
          street: street,
          zip: zip,
          phoneNo: phoneNo,
          locality: locality,
          aptName: aptName,
          lat: lat,
          lng: lng,
        },
        time : [],
        Fees : Fees,
      });
      return doctor.save();
    })

    .then((savedDoctor) => {
      client.sendEmail({
        "to": email,
        "from": "aronagnel@student.sfit.ac.in",
        "subject": "Verify your Account on E-PHARM",
        "HtmlBody": `
                      <p>Please verify your email by clicking on the link below - Pharmacy</p>
                      <p>Click this <a href="http://localhost:3002/auth/verify/${token}">link</a> to verify your account.</p>
                    `,
      });
      res.status(201).json({
        message:
          "Seller signed-up successfully, please verify your email before logging in.",
        doctorId: savedDoctor._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.createBooking = (req, res, next) => {
  const Time = req.body.Time;

  Doctor.findById(req.body.Doctor._id)
    .then((doctor) => {
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      // Ensure `time` array exists
      if (!Array.isArray(doctor.time)) {
        doctor.time = [];
      }

      // If time is already booked
      if (doctor.time.includes(Time)) {
        return res.status(400).json({ message: "Time slot already booked" });
      }
      
      // Create booking
      const booking = new Booking({
        user: {
              email: req.body.user.account.email,
              name: req.body.user.firstName,
              address: req.body.user.address,
              userId: req.body.user.account._id,
        },
        doctor: {
              name: req.body.Doctor.name,
              phone: req.body.Doctor.address.phoneNo,
              doctorId: req.body.Doctor._id,
        },
        status: req.body.status,
        time : req.body.Time,
      });

      // Save booking, then update doctor
      return booking.save().then(() => {
        doctor.time.push(Time);
        return doctor.save();
      }).then(() => {
        res.status(200).json({ message: "Appointment booked" });
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};