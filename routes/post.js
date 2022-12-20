const express = require("express");
const router = express.Router();
const { verify } = require("../modules/jwt");
const { isSignedIn, isPostWriter, isCommentWriter } = require("./middlewares");
const { Member, Post, Comment } = require("../models/index");

/**
 * 게시글 목록 조회
 */
router.get("/list", async (req, res) => {
  const postList = await Post.findAll({
    include: [
      {
        model: Member,
        as: "post_writer",
        attributes: ["member_id", "member_nickname"],
      },
    ],
  });
  return res.status(200).json({
    code: 200,
    data: postList,
  });
});

/**
 * 단일 게시글 조회
 */
router.get("/:postIdx", async (req, res) => {
  const postIdx = req.params.postIdx;

  const post = await Post.findOne({
    where: { post_idx: postIdx },
    include: [
      {
        model: Member,
        as: "post_writer",
        attributes: ["member_id", "member_nickname"],
      },
      {
        model: Comment,
        as: "comments",
        attributes: ["comment_idx", "comment_contents"],
        include: [
          {
            model: Member,
            as: "comment_writer",
            attributes: ["member_id", "member_nickname"],
          },
        ],
      },
    ],
  });

  if (post) {
    return res.status(200).json({
      code: 200,
      data: post,
    });
  } else {
    return res.status(404).json({
      code: 404,
      message: "post not found",
    });
  }
});

/**
 * 게시글 생성
 */
router.post("/", isSignedIn, async (req, res) => {
  const signedinId = verify(res.locals.token).memberId;

  const postWriter = await Member.findOne({
    where: { member_id: signedinId },
  });

  const post = {
    post_title: req.body.title,
    post_contents: req.body.contents,
    member_idx: postWriter.member_idx,
  };

  try {
    await Post.create(post);
    return res.status(201).json({
      code: 201,
      message: "create post successfully.",
    });
  } catch {
    return res.status(500).json({
      code: 500,
      message: "internal server error. please retry.",
    });
  }
});

/**
 * 게시글 수정
 */
router.patch("/:postIdx", isSignedIn, isPostWriter, async (req, res) => {
  const postIdx = req.params.postIdx;

  const post = {
    post_title: req.body.title,
    post_contents: req.body.contents,
  };

  try {
    await Post.update(post, { where: { post_idx: postIdx } });
    return res.status(201).json({
      code: 201,
      message: "modify post successfully.",
    });
  } catch {
    return res.status(500).json({
      code: 500,
      message: "internal server error. please retry.",
    });
  }
});

/**
 * 게시글 삭제
 */
router.delete(
  "/delete/:postIdx",
  isSignedIn,
  isPostWriter,
  async (req, res) => {
    const postIdx = req.params.postIdx;

    const post = await Post.findOne({
      where: { post_idx: postIdx },
    });

    if (post) {
      await Post.destroy({
        where: { post_idx: postIdx },
      });
      return res.status(200).json({
        code: 200,
        message: "delete post successfully.",
      });
    } else {
      return res.status(404).json({
        code: 404,
        message: "cannot find post. please retry.",
      });
    }
  }
);

/**
 * 특정 게시글 댓글 조회
 */
router.get("/:postIdx/comment/list", async (req, res) => {
  const postIdx = req.params.postIdx;

  try {
    const commentList = await Comment.findAll({
      where: { post_idx: postIdx },
    });
    return res.status(200).json({
      code: 200,
      data: commentList,
    });
  } catch {
    return res.status(500).json({
      code: 500,
      message: "internal server error. please retry.",
    });
  }
});

/**
 * 댓글 생성
 */
router.post("/:postIdx/comment", isSignedIn, async (req, res) => {
  const postIdx = req.params.postIdx;
  const signedinId = verify(res.locals.token).memberId;

  const commentWriter = await Member.findOne({
    where: { member_id: signedinId },
  });

  const comment = {
    comment_contents: req.body.contents,
    member_idx: commentWriter.member_idx,
    post_idx: postIdx,
  };

  await Comment.create(comment);
  return res.status(201).json({
    code: 201,
    message: "create comment successfully.",
  });
});

/**
 * 댓글 수정
 */
router.post(
  "/:postIdx/comment/:commentIdx",
  isSignedIn,
  isCommentWriter,
  async (req, res) => {
    const commentIdx = req.params.commentIdx;

    const comment = {
      comment_contents: req.body.contents,
    };

    try {
      await Comment.update(comment, { where: { comment_idx: commentIdx } });
      return res.status(201).json({
        code: 201,
        message: "modify comment successfully.",
      });
    } catch {
      return res.status(500).json({
        code: 500,
        message: "internal server error. please retry.",
      });
    }
  }
);

/**
 * 댓글 삭제
 */
router.delete(
  "/:postIdx/comment/:commentIdx",
  isSignedIn,
  isCommentWriter,
  async (req, res) => {
    const commentIdx = req.params.commentIdx;
    const comment = await Comment.findOne({
      where: { comment_idx: commentIdx },
    });

    if (comment) {
      await Comment.destroy({
        where: { comment_idx: commentIdx },
      });
      return res.status(200).json({
        code: 200,
        message: "delete comment successfully.",
      });
    } else {
      return res.status(404).json({
        code: 404,
        message: "cannot find comment. please retry.",
      });
    }
  }
);

module.exports = router;
