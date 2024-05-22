const bcrypt = require("bcryptjs");
const bcSaltRounds = bcrypt.genSaltSync(10);
const OTP = require("otp-generator");

const {
  getConnection,
  runQueryValues,
  signUpSyntax,
} = require("../modals/dbConnect");
const { genToken } = require("../utils/generators");
const { sendEmail } = require("./nodemailer");


const generateOtp = () => {
  const otp = OTP.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const expiresAt = Date.now() + 5 * 60 * 1000;

  return { otp, expiresAt };
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

    const { otp, expiresAt } = generateOtp();

    console.log(otp);
    console.log(expiresAt);

    // send the user the otp via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `<h2>Hello there</h2><br>
              <p>Welcome to Bloom App</p>
              <p>Verify your email using the 4 digits pin below</p>
              <p>${otp}</p>`
    };

    sendEmail(mailOptions)

    //Connect to the query
    const result = await runQueryValues(connect, signUpSyntax, [
      email,
      phoneNumber,
      hashedPassword,
      otp,
      expiresAt

    ]);

    res
      .status(200)
      .json({ success: true, message: "User signed up successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error signing up user" });
  }
}

const verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body

    if (!otp) return res.status(400).json({ message: "Please input pin", status: 400, success: false });

    const connect = await getConnection();

    const query = "SELECT * FROM userSignIn where email = ?"

    const checkUser = await runQueryValues(connect, query, [email])

    console.log(checkUser);

    if (!checkUser || checkUser.length === 0) {
      return res.status(400).json({ message: "Unauthorized user", status: 401, success: false });
    }

    if (checkUser[0].otp !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid pin.", status: 400, success: false });
    }

    if (Date.now() > checkUser[0].otpExpiry) {
      return  res.status(400).json({ success: false, message: 'OTP has expired.', status: 400,});
  }

  const updateUser = await runQueryValues(connect, "UPDATE userSignIn set isVerified = true, otpIsExpired = true, otp = null, otpExpiry = null where email = ?", [email])

    const authToken = genToken()

    return res.status(200).json({ message: "Email verification successful", success: true, data: authToken });


  } catch (error) {
    console.log(error);
   return res.status(500).json({ message: "Something went wrong", status: 500, success: false });
  }
}

const resendOTP = async () => {
  try {
    const { email } = req.body

    if (!email) return res.status(400).json({ message: "No email found", status: 400, success: false });

    const connect = await getConnection();

    const query = "SELECT * FROM userSignIn where email = ?"

    const checkUser = await runQueryValues(connect, query, [email])

    if (!checkUser || checkUser.length === 0) {
      return res.status(400).json({ message: "Unauthorized user", status: 401, success: false });
    }

    // send mail to 

    return res.status(200).json({ message: "Email verification successful", status: 200, success: true });


  } catch (error) {
    res.status(500).json({ message: "Something went wrong", status: 500, success: false });
  }
}


module.exports = { signUp, verifyOTP, resendOTP };
