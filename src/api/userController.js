import User from "../config/model/user.js";
import multer from "multer";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
const imageURL = "public/uploads";
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageURL);
  },
  filename: (req, file, cb) => {
    let originalname = file.originalname.split(" ").join("_");
    cb(null, originalname);
  },
});
const upload = multer({
  storage: Storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/svg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error("Only .png,.jpg,.jpeg and .svg format allowed for images..")
      );
    }
  },
});
const fileUpload = upload.any();
export default {
  login: async function (req, res) {
    try {
      if (!req.body.username) {
        return res.status(200).send({
          data: [],
          message: "Username required!",
          success: false,
        });
      }
      if (!req.body.password) {
        return res.status(200).send({
          data: [],
          message: "Password required!",
          success: false,
        });
      }
      const { username, password } = req.body;
      const user = await User.findOne({
        username: username,
      });
      if (!user) {
        return res.status(200).send({
          data: [],
          message: "User not found..!",
          success: false,
        });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(200).send({
          data: [],
          message: "password do not match..!",
          success: false,
        });
      }
      const newUser = await User.findOne(
        {
          username: username,
        },
        { password: 0 }
      );
      if (newUser.role === "admin") {
        return res.status(200).send({
          data: newUser,
          message: "Welcome to AdminPanel..!",
          success: true,
        });
      }
      return res.status(200).send({
        data: newUser,
        message: "Successfully Login..!",
        success: true,
      });
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  addUser: async (req, res) => {
    try {
      if (!req.body.fullName) {
        return res.status(200).send({
          data: [],
          message: "Full name required!",
          success: false,
        });
      }
      if (!req.body.age) {
        return res.status(200).send({
          data: [],
          message: "Age required!",
          success: false,
        });
      }
      if (isNaN(req.body.age)) {
        return res.status(200).send({
          data: [],
          message: "Age must be a number!",
          success: false,
        });
      }
      if (!req.body.dob) {
        return res.status(200).send({
          data: [],
          message: "Date of birth required!",
          success: false,
        });
      }
      if (!req.body.gender) {
        return res.status(200).send({
          data: [],
          message: "Gender required!",
          success: false,
        });
      }
      if (!req.body.email) {
        return res.status(200).send({
          data: [],
          message: "Email required!",
          success: false,
        });
      }
      if (!req.body.username) {
        return res.status(200).send({
          data: [],
          message: "Username required!",
          success: false,
        });
      }
      if (!req.body.password) {
        return res.status(200).send({
          data: [],
          message: "Password required!",
          success: false,
        });
      }
      const { fullName, age, dob, gender, email, username, password } =
        req.body;
      const encryptedPassword = await bcrypt.hash(password, 10);
      User.find({
        username: username,
      }).then((oldUser) => {
        if (oldUser.length) {
          return res.status(200).send({
            data: [],
            message: "Username already exists..!",
            success: false,
          });
        } else {
          User.create({
            fullName,
            age,
            dob,
            gender,
            email,
            bio: null,
            profilePic: null,
            role: "user",
            username,
            password: encryptedPassword,
            userStatus: "active",
          }).then((newUser) => {
            if (!newUser) {
              return res.status(200).send({
                data: [],
                message: "Failed to create your account..!",
                success: false,
              });
            }
            res.status(200).send({
              data: newUser,
              message: "User registered successfully..!",
              success: true,
            });
          });
        }
      });
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  viewUsers: async (req, res) => {
    try {
      let count = await User.find({ role: "user" }).count();
      await User.find(
        {
          role: "user",
        },
        { password: 0 }
      )
        .then((users) => {
          if (users.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No Users found..!",
              success: false,
              count: count,
            });
          }
          res.status(200).send({
            data: users,
            message: "Successfully fetched users..!",
            success: true,
            count: count,
          });
        })
        .catch((err) => {
          console.log("error", err);
          res.status(404).send({
            data: [],
            message: `error..! ${err.message}`,
            success: false,
          });
        });
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  editUsers: async (req, res) => {
    try {
      const { host } = req.headers;
      fileUpload(req, res, (err) => {
        if (err) {
          return res.status(200).send({
            data: [],
            message: `Error in image uploading..! ${err.message}`,
            success: false,
          });
        }
        if (!req.body.fullName) {
          return res.status(200).send({
            data: [],
            message: "Full name required!",
            success: false,
          });
        }
        if (!req.body.age) {
          return res.status(200).send({
            data: [],
            message: "Age required!",
            success: false,
          });
        }
        if (isNaN(req.body.age)) {
          return res.status(200).send({
            data: [],
            message: "Age must be a number!",
            success: false,
          });
        }
        if (!req.body.dob) {
          return res.status(200).send({
            data: [],
            message: "Date of birth required!",
            success: false,
          });
        }
        if (!req.body.gender) {
          return res.status(200).send({
            data: [],
            message: "Gender required!",
            success: false,
          });
        }
        if (!req.body.email) {
          return res.status(200).send({
            data: [],
            message: "Email required!",
            success: false,
          });
        }
        if (!req.body.bio) {
          return res.status(200).send({
            data: [],
            message: "Bio required!",
            success: false,
          });
        }
        if (req?.files[0]?.path === undefined) {
          // return res.status(200).send({
          //   data: [],
          //   message: "Profile pic required!",
          //   success: false,
          // });
        }
        if (!req.body.username) {
          return res.status(200).send({
            data: [],
            message: "Username required!",
            success: false,
          });
        }

        if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
          const { fullName, age, dob, gender, email, bio, username } = req.body;
          // let newFilename = req?.files[0]?.originalname.split(" ").join("_");
          const user = User.find({ _id: req.params.id });
          if (user.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No user found with given id..!",
              success: false,
            });
          } else {
            User.findByIdAndUpdate(
              req.params.id,
              {
                fullName,
                age,
                dob,
                gender,
                email,
                bio,
                profilePic: null,
                // `http://${host}/${newFilename.replaceAll(
                //   "\\",
                //   "/"
                // )}`,
                username,
              },
              {
                new: true,
              }
            )
              .select("-password")
              .then((user) => {
                res.status(200).send({
                  data: user,
                  message: "Successfully updated user..!",
                  success: true,
                });
              });
          }
        } else {
          return res.status(404).send({
            data: [],
            message: `user not found with id ${req.params.id}`,
            success: false,
          });
        }
      });
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  deleteUsers: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        User.find({ _id: req.params.id }).then((user) => {
          if (user.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No user found with given id..!",
              success: false,
            });
          } else {
            User.findByIdAndRemove(req.params.id).then((user) => {
              res.status(200).send({
                data: [],
                message: "Successfully deleted user..!",
                success: true,
              });
            });
          }
        });
      } else {
        return res.status(200).send({
          data: [],
          message: `user not found with id ${req.params.id}`,
          success: false,
        });
      }
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
  viewUserDetails: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        User.find({ _id: req.params.id }).then((user) => {
          if (user.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No user found with given id..!",
              success: false,
            });
          } else {
            User.findById({ _id: req.params.id }, { password: 0 })
              .then((user) => {
                if (user.length === 0) {
                  return res.status(200).send({
                    data: [],
                    message: "No user found..!",
                    success: false,
                  });
                }
                return res.status(200).send({
                  data: user,
                  message: "Successfully fetched user details..!",
                  success: true,
                });
              })
              .catch((err) => {
                console.log("error", err);
                return res.status(404).send({
                  data: [],
                  message: `error..! ${err.message}`,
                  status: false,
                });
              });
          }
        });
      } else {
        return res.status(200).send({
          data: [],
          message: `Cannot find user with id ${req.params.id}`,
          success: false,
        });
      }
    } catch (error) {
      console.log("error", error);
      return res.status(404).send({
        data: [],
        message: `error..! ${error.message}`,
        status: false,
      });
    }
  },
};
