import express from "express";
import prisma from "../../prisma/prisma.js";

const router = express.Router();

// 게시글 생성 API
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(404).json({
        message: "title, content가 필요합니다.",
      });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
      },
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({
      message: "서버 오류",
    });
  }
});

// 게시글 상세 조회 API
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const article = await prisma.article.findUnique({
      where: { id },

      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    if (!article) {
      return res.status(404).json({
        message: "찾을 수 없습니다.",
      });
    }
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({
      message: "서버 오류",
    });
  }
});

// 게시글 수정 API
router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { title, content } = req.body;

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return res.status(404).json({
        message: "찾을 수 없습니다.",
      });
    }
    const updatedArticle = await prisma.article.update({
      where: { id },

      data: {
        title,
        content,
      },
    });

    res.status(200).json(updatedArticle);
  } catch (err) {
    res.status(500).json({
      message: "서버 오류",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return res.status(404).json({
        message: "찾을 수 없습니다.",
      });
    }

    await prisma.article.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({
      message: "서버 오류",
    });
  }
});

// 게시글 목록 조회 API

// router.get("/", async (req,res) => {
//     try{
//         let{ page, limit, keyword, sort} = req.query;
//     }
// })

export default router;
