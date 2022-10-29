import Ads from "../config/model/ads.js";
import multer from "multer";
import mongoose from "mongoose";
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
  addAds: async (req, res) => {
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
        if (!req.body.title) {
          return res.status(200).send({
            data: [],
            message: "Title required!",
            success: false,
          });
        }
        if (req?.files[0]?.path === undefined) {
          return res.status(200).send({
            data: [],
            message: "Image required!",
            success: false,
          });
        }
        const { title } = req.body;
        let newFilename = req?.files[0]?.originalname.split(" ").join("_");
        Ads.create({
          title,
          image: `http://${host}/${newFilename.replaceAll("\\", "/")}`,
        }).then((newAds) => {
          if (!newAds) {
            return res.status(200).send({
              data: [],
              message: "Failed to create new ads..!",
              success: false,
            });
          }
          res.status(200).send({
            data: newAds,
            message: "Ads posted successfully..!",
            success: true,
          });
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
  viewAds: async (req, res) => {
    try {
      let count = await Ads.find().count();
      await Ads.find()
        .then((ads) => {
          if (ads.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No ads found..!",
              success: false,
              count: count,
            });
          }
          res.status(200).send({
            data: ads,
            message: "Successfully fetched ads..!",
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
  editAds: async (req, res) => {
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
        if (!req.body.title) {
          return res.status(200).send({
            data: [],
            message: "Title required!",
            success: false,
          });
        }
        if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
          const { title } = req.body;
          const ads = Ads.find({ _id: req.params.id });
          if (ads.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No ads found with given id..!",
              success: false,
            });
          } else {
            if (req?.files[0]?.path) {
              let newFilename = req?.files[0]?.originalname
                .split(" ")
                .join("_");
              Ads.findByIdAndUpdate(
                req.params.id,
                {
                  title,
                  image: `http://${host}/${newFilename.replaceAll("\\", "/")}`,
                },
                {
                  new: true,
                }
              ).then((ads) => {
                res.status(200).send({
                  data: ads,
                  message: "Successfully updated ads..!",
                  success: true,
                });
              });
            } else {
              Ads.findByIdAndUpdate(
                req.params.id,
                {
                  title,
                },
                {
                  new: true,
                }
              ).then((ads) => {
                res.status(200).send({
                  data: ads,
                  message: "Successfully updated ads..!",
                  success: true,
                });
              });
            }
          }
        } else {
          return res.status(404).send({
            data: [],
            message: `Ads not found with id ${req.params.id}`,
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
  deleteAds: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        Ads.find({ _id: req.params.id }).then((ads) => {
          if (ads.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No ads found with given id..!",
              success: false,
            });
          } else {
            Ads.findByIdAndRemove(req.params.id).then((ads) => {
              res.status(200).send({
                data: [],
                message: "Successfully deleted ads..!",
                success: true,
              });
            });
          }
        });
      } else {
        return res.status(200).send({
          data: [],
          message: `Ads not found with id ${req.params.id}`,
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
  viewAdsDetails: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        Ads.find({ _id: req.params.id }).then((ads) => {
          if (ads.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No ads found with given id..!",
              success: false,
            });
          } else {
            Ads.findById({ _id: req.params.id })
              .then((ads) => {
                if (ads.length === 0) {
                  return res.status(200).send({
                    data: [],
                    message: "No ads found..!",
                    success: false,
                  });
                }
                return res.status(200).send({
                  data: ads,
                  message: "Successfully fetched ads details..!",
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
          message: `Cannot find ads with id ${req.params.id}`,
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
