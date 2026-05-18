import express from "express";
import prisma from "../../prisma/prisma.js";

const router = express.Router();

// 상품 생성 API
router.post("/", async (req, res) => {
  try {
    const { name, description, price, tags, favoriteCount } = req.body;

    if (!name || !description || !price || !tags) {
      return res.status(404).json({
        message: "name, description, price, tags는 필수입니다.",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
        favoriteCount: favoriteCount ?? 0,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: "서버 오류",
    });
  }
});

// 상품 상세 조회 API
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },

      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "찾을 수 없습니다.",
      });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({
      message: "서버 오류",
    });
  }
});

// 상품 수정 API
router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { title, content } = req.body;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        message: "찾을 수 없습니다.",
      });
    }
    const updatedProduct = await prisma.product.update({
      where: { id },

      data: {
        title,
        content,
      },
    });

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({
      message: "서버 오류",
    });
  }
});

// 상품 삭제 API
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        message: "찾을 수 없습니다.",
      });
    }

    await prisma.product.delete({
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
