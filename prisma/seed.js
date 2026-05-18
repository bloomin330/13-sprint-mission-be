import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.comment.deleteMany();
  console.log("기존 데이터 삭제 완료");
  const article1 = await prisma.article.create({
    data: {
      title: "첫 번째 게시글",
      content: "안녕하세요 자유게시판입니다.",
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: "두 번째 게시글",
      content: "Prisma 너무 재밌다",
    },
  });

  const product1 = await prisma.product.create({
    data: {
      name: "노트북",
      description: "게이밍 노트북",
      price: 1500000,
      tags: ["electronics", "laptop"],
      favoriteCount: 0,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "키보드",
      description: "기계식 키보드",
      price: 120000,
      tags: ["keyboard", "mechanical"],
      favoriteCount: 3,
    },
  });

  await prisma.comment.createMany({
    data: [
      {
        content: "첫 댓글입니다!",
        articleId: article1.id,
      },
      {
        content: "좋은 글이네요",
        articleId: article1.id,
      },
      {
        content: "이 제품 좋아요",
        productId: product1.id,
      },
      {
        content: "가격 괜찮네요",
        productId: product2.id,
      },
    ],
  });
  console.log("seed 파일 생성");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
