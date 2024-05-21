const bcrypt = require("bcryptjs");
const bcSaltRounds = bcrypt.genSaltSync(10);
const OTP = require("otp-generator");

const {
  getConnection,
  runQueryValues,
  signUpSyntax,
} = require("../modals/dbConnect");


const generateOtp = () => {
  const otp = OTP.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  return otp;
};

async function signUp(req, res) {
  try {
    const { email, phoneNumber, password } = req.body;

    if (!email && !phoneNumber) {
      return res
        .status(400)
        .json({ message: "Email or phone number is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const connect = await getConnection();

    const hashedPassword = bcrypt.hashSync(password, bcSaltRounds);

    const userExist = await runQueryValues(
      connect,
      "select * from userSignIn where email = ?",
      [email]
    );
    console.log(userExist)
    if (userExist.length !== 0) {
      return res
        .status(500)
        .json({ success: false, message: "User already exist" });
    }


    const phoneNumberExist = await runQueryValues(
      connect,
      "select * from userSignIn where phoneNumber = ?",
      [phoneNumber]
    );
    if (phoneNumberExist.length !== 0) {
      return res
        .status(500)
        .json({ success: false, message: "User already exist" });
    }

    const otp = generateOtp();

    //Connect to the query
    const result = await runQueryValues(connect, signUpSyntax, [
      email,
      phoneNumber,
      hashedPassword,
      otp,
    ]);
    console.log(result);
    res
      .status(200)
      .json({ success: true, message: "User signed up successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error signing up user" });
  }
}

module.exports = { signUp };
