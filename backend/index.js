import express from "express";
const app = express();
const port = 3000;

import cors from "cors";
app.use(cors());
app.use(express.json());

import mongoose from "mongoose";
import { userModel } from "./model/user.js";

mongoose
  .connect(
    `mongodb+srv://leeyeeun:lcs2525684@cluster0.094tluf.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("MongoDB 연결됨");
  })
  .catch((err) => {
    console.log("MongoDB 연결 안됨", err);
  });
app.get("/", (req, res) => {
  res.send("Hello world");
});
app.post("/register", async (req, res) => {
  console.log("----", req.body);
  const { username, password } = req.body;

  // userModel에서 이미 존재하는 사용자인지 확인
  // 새 사용자를 생성
  // mongdb에 저장
  // 저장 성공 하면 프론트엔드로 응답 메시지 전송

  const existingUser = await userModel.findOne({ username });
  if (existingUser) {
    return res.json({ message: "이미 존재하는 사용자입니다." });
  }
  const userDoc = new userModel({ username, password });
  const savedUser = await userDoc.save();

  res.status(201).json({
    user: {
      username: savedUser.username,
      _id: savedUser._id,
    },
  });
});
app.listen(port, () => {
  console.log(`${port} 포트에서 돌고 있음`);
});
