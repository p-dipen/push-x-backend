const User = require("../models/User");
const authService = require("../services/auth.service");
const bcryptService = require("../services/bcrypt.service");
const encrypttService = require("../services/encrypt_decrypt");
// const admin = require("firebase-admin");
const MailConfig = require("../../config/email");

// const serviceAccount = require("../../firebase/push-x-6c832-firebase-adminsdk-e3u4e-4a171d87d9.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://push-x-6c832.firebaseio.com"
// });

const UserController = () => {
  const register = async (req, res) => {
    const { body } = req;
    console.log(body.email);
    try {
      const user = await User.create({
        email: body.email,
        firstname: body.firstname,
        lastname: body.lastname,
        phonenumber: body.number
      });
      let encrptytext = encrypttService().encrypt(user.email);
      await MailConfig.sendactivateCode(
        user.email,
        "",
        user.firstname + " " + user.lastname,
        "http://localhost:3000/#/activate/" + encrptytext
      );
      // const token = authService().issue({ id: user.id });
      return res.status(200).json({
        success: true,
        msg: "Success"
      });
    } catch (err) {
      console.log(err);
      return res.status(200).json({
        success: false,
        msg: "Email is already exists"
      });
    }
  };

  const login = async (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
      try {
        const user = await User.findOne({
          where: {
            email
          }
        });

        if (!user) {
          return res.status(200).json({
            success: false,
            msg: "Email or password is wrong"
          });
        }
        if (encrypttService().encrypt(password) == user.password) {
          const token = authService().issue({
            id: user.id
          });

          return res.status(200).json({
            success: true,
            msg: "Login success",
            token,
            user
          });
        }

        return res.status(200).json({
          success: false,
          msg: "Email or password is wrong"
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          msg: "Internal server error"
        });
      }
    }

    return res.status(200).json({
      success: false,
      msg: "Email or password is wrong"
    });
  };

  const checkactivate = async (req, res) => {
    const { activation } = req.body;

    if (activation) {
      try {
        let email = encrypttService().decrypt(activation);
        const user = await User.findOne({
          where: {
            email: email,
            activation: false
          }
        });

        if (!user) {
          return res.status(200).json({
            success: false,
            msg: "Bad Request: User not found"
          });
        }

        return res.status(200).json({
          success: true
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          msg: "Internal server error"
        });
      }
    }

    return res.status(200).json({
      success: false,
      msg: "Activation code is wrong"
    });
  };

  const updatePassword = async (req, res) => {
    const { activation, password } = req.body;

    if (activation && password) {
      try {
        console.log(password);
        let email = encrypttService().decrypt(activation);
        const user = await User.update(
          {
            password: encrypttService().encrypt(password),
            activation: true
          },
          {
            returning: true,
            where: {
              email: email,
              activation: false
            }
          }
        );

        if (!user) {
          return res.status(200).json({
            success: false,
            msg: "Bad Request: User not found"
          });
        }
        const token = authService().issue({
          id: user.id
        });
        let userdetail = await User.findOne({
          email: email
        });
        return res.status(200).json({
          success: true,
          msg: "update",
          token,
          userdetail
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          msg: "Internal server error"
        });
      }
    }

    return res.status(200).json({
      success: false,
      msg: "Activation code is wrong"
    });
  };

  const validate = (req, res) => {
    const { token } = req.body;

    authService().verify(token, err => {
      if (err) {
        return res.status(401).json({
          isvalid: false,
          err: "Invalid Token!"
        });
      }

      return res.status(200).json({
        isvalid: true
      });
    });
  };

  const getAll = async (req, res) => {
    try {
      const users = await User.findAll();

      return res.status(200).json({
        users
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        msg: "Internal server error"
      });
    }
  };
  const runing = async (req, res) =>
    res.status(200).json({
      runing: "runniong"
    });

  return {
    register,
    login,
    validate,
    getAll,
    runing,
    checkactivate,
    updatePassword
  };
};

module.exports = UserController;
