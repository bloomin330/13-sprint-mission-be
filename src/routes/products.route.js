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
        name: true,
        description: true,
        price: true,
        tags: true,
        favoriteCount: true,
        createdAt: true,
        updatedAt: true,
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

    const { name, description, price, tags, favoriteCount } = req.body;

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
        name,
        description,
        price,
        tags,
        favoriteCount,
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

// 상품 목록 조회 API
router.get("/", async (req, res) => {
  try {
    let { page, limit, sort, keyword } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const skip = (page - 1) * limit;

    const where = keyword
      ? {
          OR: [
            {
              name: {
                contains: keyword,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: keyword,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

    const orderBy =
      sort === "old" ? { createdAt: "asc" } : { createdAt: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        favoriteCount: true,
        createdAt: true,
      },
    });

    const total = await prisma.product.count({
      where,
    });

    res.status(200).json({
      data: products,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({
      message: "SERVER ERROR",
    });
  }
});

export default router;
