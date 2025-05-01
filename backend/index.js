import express from "express";
const app = express();
const port = 3000;

import cors from "cors";
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // true로 설정하면 쿠키를 포함한 요청을 허용합니다.
  })
);
app.use(express.json());

import cookieParser from "cookie-parser";
app.use(cookieParser());

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

import bcrypt from "bcryptjs";
const saltRounds = 10; // salt의 길이

import jwt from "jsonwebtoken";
const secretKey = "testtest";
const tokenLife = "1h"; // 토큰 유효시간

app.get("/", (req, res) => {
  res.send("Hello world");
});
app.post("/register", async (req, res) => {
  console.log("----", req.body);
  const { username, password } = req.body;

  const existingUser = await userModel.findOne({ username });
  if (existingUser) {
    return res.json({ message: "이미 존재하는 사용자입니다." });
  }
  const userDoc = new userModel({
    username,
    password: bcrypt.hashSync(password), // 비밀번호가 암호화됨
  });
  const savedUser = await userDoc.save();

  res.status(201).json({
    user: {
      username: savedUser.username,
      _id: savedUser._id,
    },
  });
});
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userDoc = await userModel.findOne({ username });
    if (!userDoc) return res.status(401).json({ error: "없는 id" });

    // 비밀번호 확인
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) return res.status(401).json({ error: "없는 pwd" });
    else {
      // JWT 토큰 발급
      const { _id, username } = userDoc;
      const payload = { id: _id, username };
      const token = jwt.sign(payload, secretKey, {
        expiresIn: tokenLife,
      });
      res
        .cookie("token", token, {
          httpOnly: true, // js에서 접근 불가
          sameSite: "strict", // CSRF 공격 방지
        })
        .json({
          id: userDoc._id,
          username,
        });
      console.log("찾은 사용자 있음");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "서버 에러" });
  }
});
//회원정보 조회
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  console.log("쿠키", token);
  if (!token) {
    return res.status(401).json({ error: "로그인 필요" });
  }
  jwt.verify(token, secretKey, (err, info) => {
    if (err) {
      return res.json({ error: "로그인 필요" });
    }
    res.json(info);
  });
});
app.post("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // 쿠키 만료 시간을 0으로 설정하여 삭제
    })
    .json({ message: "로그아웃 되었음" });
});

app.listen(port, () => {
  console.log(`${port} 포트에서 돌고 있음`);
});
