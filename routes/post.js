const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { verify } = require("../modules/jwt");
const { isSignedIn, isPostWriter, isCommentWriter } = require("./middlewares");
const { Member, Post, Comment } = require("../models/index");

/**
 * 게시글 목록 조회
 */
router.get("/list", async (req, res) => {
  const { start, count } = req.query;
  try {
    const postList = await Post.findAll({
      order: [["createdAt", "DESC"]],
      attributes: {
        include: [
          [
            Sequelize.fn("COUNT", Sequelize.col("comments.comment_idx")),
            "comments_count",
          ],
        ],
      },
      include: [
        {
          model: Member,
          as: "post_writer",
          attributes: ["member_id", "member_nickname"],
        },
        {
          model: Comment,
          attributes: [],
        },
      ],
      offset: start ? Number(start) : null,
      limit: count ? Number(count) : null,
      subQuery: false,
      group: ["post_idx"],
    });
    return res.status(StatusCodes.OK).json({
      data: postList,
    });
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 단일 게시글 조회
 */
router.get("/:postIdx", async (req, res) => {
  try {
    const postIdx = req.params.postIdx;

    const post = await Post.findOne({
      where: { post_idx: postIdx },
      include: [
        {
          model: Member,
          as: "post_writer",
          attributes: ["member_id", "member_nickname"],
        },
      ],
    });
    if (post) {
      return res.status(StatusCodes.OK).json({
        data: post,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 게시글 생성
 */
router.post("/", isSignedIn, async (req, res) => {
  try {
    const signedinId = verify(res.locals.token).memberId;

    const postWriter = await Member.findOne({
      where: { member_id: signedinId },
    });

    const post = {
      post_title: req.body.title,
      post_contents: req.body.contents,
      member_idx: postWriter.member_idx,
    };

    await Post.create(post);
    return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 게시글 수정 권한 확인
 */
router.get("/:postIdx/iswriter", isSignedIn, isPostWriter, (req, res) => {
  return res.status(StatusCodes.OK).send(StatusCodes.OK);
});

/**
 * 게시글 수정
 */
router.patch("/:postIdx", isSignedIn, isPostWriter, async (req, res) => {
  try {
    const postIdx = req.params.postIdx;

    const post = {
      post_title: req.body.title,
      post_contents: req.body.contents,
    };

    await Post.update(post, { where: { post_idx: postIdx } });
    return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 게시글 삭제
 */
router.delete("/:postIdx", isSignedIn, isPostWriter, async (req, res) => {
  try {
    const postIdx = req.params.postIdx;

    const post = await Post.findOne({
      where: { post_idx: postIdx },
    });

    if (post) {
      await Post.destroy({
        where: { post_idx: postIdx },
      });
      return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
    } else {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 특정 게시글 댓글 조회
 */
router.get("/:postIdx/comment/list", async (req, res) => {
  const { start, count } = req.query;
  try {
    const postIdx = req.params.postIdx;

    const commentList = await Comment.findAll({
      where: { post_idx: postIdx },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Member,
          as: "comment_writer",
          attributes: ["member_id", "member_nickname"],
        },
      ],
      offset: start ? Number(start) : null,
      limit: count ? Number(count) : null,
    });
    return res.status(StatusCodes.OK).json({
      data: commentList,
    });
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 댓글 생성
 */
router.post("/:postIdx/comment", isSignedIn, async (req, res) => {
  try {
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
    return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 댓글 수정 권한 확인
 */
router.get(
  "/:postIdx/comment/:commentIdx/iswriter",
  isSignedIn,
  isCommentWriter,
  (req, res) => {
    return res.status(StatusCodes.OK).send(StatusCodes.OK);
  }
);

/**
 * 댓글 수정
 */
router.patch(
  "/:postIdx/comment/:commentIdx",
  isSignedIn,
  isCommentWriter,
  async (req, res) => {
    try {
      const commentIdx = req.params.commentIdx;

      const comment = {
        comment_contents: req.body.contents,
      };

      await Comment.update(comment, { where: { comment_idx: commentIdx } });
      return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
    } catch {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
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
    try {
      const commentIdx = req.params.commentIdx;
      const comment = await Comment.findOne({
        where: { comment_idx: commentIdx },
      });

      if (comment) {
        await Comment.destroy({
          where: { comment_idx: commentIdx },
        });
        return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
      } else {
        return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
      }
    } catch {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }
);

module.exports = router;
