import express from "express";
import { PrismaClient } from "@prisma/client";
import articleRouter from "./routes/articles.route.js";
import productRouter from "./routes/products.route.js";
import productCommentRouter from "./routes/productComment.route.js";
import articleCommentRouter from "./routes/articleComment.route.js";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use("/articles", articleRouter);
app.use("/products", productRouter);
app.use("/articles", articleCommentRouter);
app.use("/products", productCommentRouter);

app.listen(3000, () => {
  console.log("서버 시작");
});
