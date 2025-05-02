import dotenv from "dotenv";
dotenv.config(); // .env 파일을 읽어 환경변수로 설정합니다.

import express from "express";
const app = express();
const port = process.env.PORT;

import cors from "cors";
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // true로 설정하면 쿠키를 포함한 요청을 허용합니다.
  })
);
app.use(express.json());

import cookieParser from "cookie-parser";
app.use(cookieParser());

import mongoose from "mongoose";
import { userModel } from "./model/user.js";

mongoose
  .connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME })
  .then(() => {
    console.log("MongoDB 연결됨");
  })
  .catch((err) => {
    console.log("MongoDB 연결 안됨", err);
  });

import bcrypt from "bcryptjs";
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS); // salt의 길이
import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET;
const tokenLife = process.env.JWT_EXPIRATION; // 토큰 유효시간

const cookiesOption = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24, // 쿠키 만료 시간 (1일)
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

app.post("/register", async (req, res) => {
  try {
    console.log("-----", req.body);
    const { username, password } = req.body;

    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "이미 존재하는 아이디입니다." });
    }
    const userDoc = new userModel({
      username,
      password: bcrypt.hashSync(password, saltRounds), // 비밀번호가 암호화됨
    });
    const savedUser = await userDoc.save();

    res.status(201).json({
      username: savedUser.username,
      _id: savedUser._id,
    });
  } catch (err) {
    console.log("에러", err);
    res.status(500).json({ error: "서버 에러" });
  }
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
      res.cookie("token", token, cookiesOption).json({
        id: userDoc._id,
        username,
      });
      console.log("찾은 사용자 있음");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "로그인 실패" });
  }
});
//회원정보 조회
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  console.log("쿠키", token);
  if (!token) {
    return res.json({ error: "로그인 필요" });
  }
  jwt.verify(token, secretKey, (err, info) => {
    if (err) {
      return res.json({ error: "로그인 필요" });
    }
    res.json(info);
  });
});
app.post("/logout", (req, res) => {
  const logoutToken = {
    ...cookiesOption,
    maxAge: 0, // 쿠키 만료 시간을 0으로 설정하여 삭제
  };
  res.cookie("token", "", logoutToken).json({ message: "로그아웃 되었음" });
});

// 게시글 작성
import multer from "multer";
import path from "path";
import fs from "fs";
import { postModel } from "./model/post.js";

// 업로할 디렉토리 없으면 자동생성
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/postWrite", upload.single("files"), async (req, res) => {
  try {
    const { token } = req.cookies; // 쿠키에서 사용자 정보 가져오기
    if (!token) {
      return res.json({ error: "로그인 필요" });
    }
    const userInfo = jwt.verify(token, secretKey);
    const { title, summary, content } = req.body;
    const postData = {
      title,
      summary,
      content,
      cover: req.file ? req.file.path : null, // 업로드된 파일 경로
      author: userInfo.username,
    };

    const post = await postModel.create(postData);
    console.log(post);
    res.json({ message: "게시글 작성 완료" });
  } catch (err) {
    console.log("게시글 작성 에러", err);
    return res.status(500).json({ error: "게시글 작성 실패" });
  }
});

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/uploads/:filename", (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, "uploads", filename));
});
// 게시글 목록 조회
app.get("/postList", async (req, res) => {
  try {
    const posts = await postModel.find().sort({ createdAt: -1 }).limit(3);
    res.json(posts);
  } catch (error) {
    console.log("게시글 목록 조회 에러", error);
    res.status(500).json({ error: "게시글 목록 조회 실패" });
  }
});
app.get("/postDetail/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await postModel.findById(postId);
    res.json(post);
  } catch (err) {
    console.log("게시글 상세 조회 에러", err);
    res.status(500).json({ error: "게시글 상세 조회 실패" });
  }
});
app.listen(port, () => {
  console.log(`${port} 포트에서 돌고 있음`);
});
