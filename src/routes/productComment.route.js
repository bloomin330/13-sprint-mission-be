import express from "express";
import prisma from "../../prisma/prisma.js";

const router = express.Router();

// 댓글 등록 Product API
router.post("/:productId/comments", async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const { content } = req.body;

    const comment = await prisma.productComment.create({
      data: { content, productId },
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "SERVER ERROR" });
  }
});

// 댓글 수정 Product API
router.patch("/comments/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { content } = req.body;

    const updated = await prisma.productComment.update({
      where: { id },
      data: { content },
    });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "SERVER ERROR" });
  }
});

// 댓글 삭제 Product API
router.delete("/comments/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.productComment.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "SERVER ERROR" });
  }
});

// 댓글 목록 조회 Product API
router.get("/:productId/comments", async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const { cursor, limit } = req.query;

    const take = Number(limit) || 10;

    const comments = await prisma.productComment.findMany({
      where: { productId },

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
