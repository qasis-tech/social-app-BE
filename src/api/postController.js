import Post from "../config/model/post.js";
import multer from "multer";
const ObjectId = mongoose.Types.ObjectId;
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
  addPost: async (req, res) => {
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
        Post.create({
          title,
          image: `http://${host}/${newFilename.replaceAll("\\", "/")}`,
        }).then((newPost) => {
          if (!newPost) {
            return res.status(200).send({
              data: [],
              message: "Failed to create new post..!",
              success: false,
            });
          }
          res.status(200).send({
            data: newPost,
            message: "Post created successfully..!",
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
  viewPosts: async (req, res) => {
    try {
      let count = await Post.find().count();
      await Post.find()
        .then((posts) => {
          if (posts.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No posts found..!",
              success: false,
              count: count,
            });
          }
          res.status(200).send({
            data: posts,
            message: "Successfully fetched posts..!",
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
  editPosts: async (req, res) => {
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
          const post = Post.find({ _id: req.params.id });
          if (post.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No post found with given id..!",
              success: false,
            });
          } else {
            if (req?.files[0]?.path) {
              let newFilename = req?.files[0]?.originalname
                .split(" ")
                .join("_");
              Post.findByIdAndUpdate(
                req.params.id,
                {
                  title,
                  image: `http://${host}/${newFilename?.replaceAll("\\", "/")}`,
                },
                {
                  new: true,
                }
              ).then((post) => {
                res.status(200).send({
                  data: post,
                  message: "Successfully updated post..!",
                  success: true,
                });
              });
            } else {
              Post.findByIdAndUpdate(
                req.params.id,
                {
                  title,
                },
                {
                  new: true,
                }
              ).then((post) => {
                res.status(200).send({
                  data: post,
                  message: "Successfully updated post..!",
                  success: true,
                });
              });
            }
          }
        } else {
          return res.status(404).send({
            data: [],
            message: `Post not found with id ${req.params.id}`,
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
  deletePost: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        Post.find({ _id: req.params.id }).then((post) => {
          if (post.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No post found with given id..!",
              success: false,
            });
          } else {
            Post.findByIdAndRemove(req.params.id).then((post) => {
              res.status(200).send({
                data: [],
                message: "Successfully deleted post..!",
                success: true,
              });
            });
          }
        });
      } else {
        return res.status(200).send({
          data: [],
          message: `Post not found with id ${req.params.id}`,
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
  viewPostDetails: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        Post.find({ _id: req.params.id }).then((post) => {
          if (post.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No post found with given id..!",
              success: false,
            });
          } else {
            Post.findById({ _id: req.params.id })
              .then((post) => {
                if (post.length === 0) {
                  return res.status(200).send({
                    data: [],
                    message: "No post found..!",
                    success: false,
                  });
                }
                return res.status(200).send({
                  data: post,
                  message: "Successfully fetched post details..!",
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
          message: `Cannot find post with id ${req.params.id}`,
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
  addComments: async (req, res) => {
    try {
      if (!req.body.post_id) {
        return res.status(200).send({
          data: [],
          message: "Post id required!",
          success: false,
        });
      }
      if (!req.body.comments) {
        return res.status(200).send({
          data: [],
          message: "Comments required!",
          success: false,
        });
      }
      if (mongoose.Types.ObjectId.isValid(req.body.post_id) === true) {
        const { post_id, comments } = req.body;
        Post.find({ _id: post_id }).then((post) => {
          if (post.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No post found with given id..!",
              success: false,
            });
          } else {
            comments._id = new ObjectId();
            let commentArray = post[0].comments;
            commentArray.push(comments);
            Post.findByIdAndUpdate(
              req.body.post_id,
              {
                comments: commentArray,
              },
              {
                new: true,
              }
            ).then((post) => {
              res.status(200).send({
                data: post,
                message: "Comments added successfully..!",
                success: true,
              });
            });
          }
        });
      } else {
        return res.status(404).send({
          data: [],
          message: `Post not found with id ${req.body.post_id}`,
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
  approveComments: async (req, res) => {
    try {
      if (mongoose.Types.ObjectId.isValid(req.params.id) === true) {
        Post.find({ "$comments._id": req.params.id }).then((post) => {
          if (post.length === 0) {
            return res.status(200).send({
              data: [],
              message: "No comments found with given id..!",
              success: false,
            });
          } else {
            Post.updateOne(
              {
                "comments._id": ObjectId(req.params.id),
              },
              { $set: { "comments.$.status": "denied" } }
            ).then((post) => {
              res.status(200).send({
                data: [],
                message: "Comment denied..!",
                success: true,
              });
            });
          }
        });
      } else {
        return res.status(404).send({
          data: [],
          message: `Comment not found with id ${req.params.id}`,
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
