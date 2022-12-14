const connectToDb = require('../dbConnect');
const alumni = require("../models/model").alumni;
//const bcrypt = require("bcrypt");
var crypto = require('crypto')
const MONGOOSE_URL = process.env.MONGOOSE_URL

//var conn = mongoose.createConnection(MONGOOSE_URL);
//const alumniModel = conn.model(alumni)
//const alumniconn = new alumniModel
//SIGN UP NEW USERS
//connectToDb()
const signup = async (req, res) => {

  try {
    const {
      email,
      firstName,
      lastName,
      password,
      dateOfBirth,
      gender,
      phoneNumber,
      yearOfEntry,
      registrationNumber,
      yearOfGraduation,
      faculty,
    } = req.body;

    if (
      !(
        email &&
        firstName &&
        lastName &&
        password &&
        dateOfBirth &&
        gender &&
        phoneNumber &&
        yearOfEntry &&
        registrationNumber &&
        yearOfGraduation &&
        faculty
      )
    ) {
      return res.status(400).send("All Input Is Required");
    }
    const oldUser = await alumni.findOne({ email });
    if (oldUser) {
      return res.redirect("/signup", { message: "Alumni Exist, Please Login. " });
    }
    var salt = crypto.randomBytes(16).toString('hex')
    const hashpassword = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
    const newUser = new alumni({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashpassword,
      salt: salt,
      dateOfBirth,
      gender,
      phoneNumber,
      yearOfEntry,
      registrationNumber,
      yearOfGraduation,
      faculty,
    });

    const user = await newUser.save();

    res.render('registersuccess', { status: "success", user: user.firstNames });
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

// LOGIN USERS
/*const login = async (req, res) => {
  const email = req.body.email
  console.log(`my email is ${email}`)
  res.render('dashboard', { email: email });
   try {
 
     const user = await alumni.findOne({ email: req.body.email });
 
     if (!user) {
       return res.status(400).json("Wrong Details, Try Again");
     }
 
     //const match = await bcrypt.compare(req.body.password, user.password);
 
     if (!match) {
       return res.status(400).json("Wrong password, Try Again");
     }
 
     const { password, ...others } = user._doc;
     res.status(200).json({ others });
   } catch (error) {
     res.status(500).json(error.message);
   }
};*/

//module.exports = { signup, login };
module.exports = { signup }