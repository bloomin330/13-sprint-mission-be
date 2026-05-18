import express from "express";
import { PrismaClient } from "@prisma/client";
import articleRouter from "./routes/articles.route.js";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use("/articles", articleRouter);

app.listen(3000, () => {
  console.log("서버 시작");
});
