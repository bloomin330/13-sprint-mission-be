import express from "express";
import prisma from "../../prisma/prisma.js";

const router = express.Router();

// 댓글 등록 Article API
router.post("/articleId/comments", async (req, res) => {
  try {
    const articleId = Number(req.params.articleId);
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "찾을 수 없습니다." });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// 댓글 수정 Article API
router.patch("/comments/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { contetn } = req.body;

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return res.status(404).json({ message: "찾을 수 없습니다" });
    }
    const updated = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// 댓글 삭제 Article API
router.delete("/comments/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const comment = await prisma.comment.findFirst({
      where: { id },
    });

    if (!comment) {
      return res.status(404).json({ message: "찾을 수 없습니다." });
    }
    await prisma.comment.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "서버 오류" });
  }
});

// 댓글 목록 조회 Article API
router.get("/:articleId/comments", async (req, res) => {
  try {
    const articleId = Number(req.params.articleId);
    const { cursor, limit } = req.query;

    const take = Number(limit) || 10;

    const comments = await prisma.articleComment.findMany({
      where: { articleId },

      take,

      ...(cursor && {
        skip: 1,
        cursor: { id: Number(cursor) },
      }),

      orderBy: {
        id: "desc",
      },

      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      data: comments,
      nextCursor: comments.length > 0 ? comments[comments.length - 1].id : null,
    });
  } catch (err) {
    res.status(500).json({ message: "SERVER ERROR" });
  }
});

export default router;
