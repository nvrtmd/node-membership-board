const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { sign, verify } = require("../modules/jwt");
const { isSignedIn, isAdmin } = require("./middlewares");
const { Member, Post, Comment } = require("../models/index");

/**
 * 회원 목록 조회
 */
router.get("/list", isSignedIn, isAdmin, async (req, res) => {
  try {
    const memberList = await Member.findAll();
    return res.status(StatusCodes.OK).json({
      data: memberList,
    });
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 회원 정보 조회
 */
router.get("/info", isSignedIn, async (req, res) => {
  try {
    const signedinMember = await Member.findOne({
      where: { member_id: verify(res.locals.token).memberId },
    });

    const signedinMemberInfo = await Member.findByPk(
      signedinMember.member_idx,
      {
        attributes: ["member_id", "member_nickname"],
      }
    );
    return res.status(StatusCodes.OK).json({
      data: signedinMemberInfo,
    });
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 회원 정보 수정
 */
router.patch("/info", isSignedIn, async (req, res) => {
  try {
    const signedinMember = await Member.findOne({
      where: { member_id: verify(res.locals.token).memberId },
    });

    const info = {
      member_id: req.body.id,
      member_nickname: req.body.nickname,
    };

    await Member.update(info, {
      where: { member_idx: signedinMember.member_idx },
    });

    const memberId = {
      memberId: req.body.id,
    };
    const token = sign(memberId);

    res.setHeader(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=none; secure=true;`
    );

    return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 회원 게시글 조회
 */
router.get("/posts", isSignedIn, async (req, res) => {
  const { start, count } = req.query;
  try {
    const signedinMemberInfo = await Member.findOne({
      where: { member_id: verify(res.locals.token).memberId },
    });

    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]],
      where: {
        member_idx: signedinMemberInfo.member_idx,
      },
      include: [
        {
          model: Member,
          as: "post_writer",
          attributes: ["member_id", "member_nickname"],
        },
        {
          model: Comment,
          attributes: [
            [
              Sequelize.fn("COUNT", Sequelize.col("comment_idx")),
              "comments_count",
            ],
          ],
        },
      ],
      offset: start ? Number(start) : undefined,
      limit: count ? Number(count) : undefined,
      group: ["post_idx"],
    });
    return res.status(StatusCodes.OK).json({
      data: posts.map((post) => {
        return {
          ...post.dataValues,
          comments_count: post.dataValues.comments[0]
            ? post.dataValues.comments[0].dataValues.comments_count
            : 0,
          comments: undefined,
        };
      }),
    });
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

/**
 * 회원 탈퇴
 */
router.delete("/", isSignedIn, async (req, res) => {
  try {
    const signedinMemberInfo = await Member.findOne({
      where: { member_id: verify(res.locals.token).memberId },
    });

    if (signedinMemberInfo) {
      await Member.destroy({
        where: { member_idx: signedinMemberInfo.member_idx },
      });
      res.setHeader(
        "Set-Cookie",
        `token=${res.locals.token}; Path=/; HttpOnly; SameSite=none; secure=true; Max-Age=0`
      );

      return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
    } else {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
});

module.exports = router;
