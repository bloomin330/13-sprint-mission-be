import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.comment.deleteMany();
  console.log("기존 데이터 삭제 완료");

  // 사용자 생성
  const products = await prisma.user.createMany({
    data: [{ name: "Alice" }, { name: "Bob" }],
  });

  console.log(`${users.count}명 사용자 생성`);

  // Todo 생성
  const todos = await prisma.todo.createMany({
    data: [
      {
        title: "우유 사오기",
        content: "저지방 1L",
        isDone: false,
      },
      {
        title: "Prisma 공부하기",
        content: "[3] 챕터까지 끝내기",
        isDone: false,
      },
      {
        title: "운동하기",
        content: "30분 조깅",
        isDone: true,
      },
      {
        title: "이메일 확인",
        isDone: true,
      },
    ],
  });

  console.log(`${todos.count}개 Todo 생성`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
