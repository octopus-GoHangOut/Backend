import express from "express";
import multer from "multer";
import path from "path";
import { __srcdirname } from "../fs.js";
import { create, find, remove, update } from "../models/restaurants.js";

// 이미지 저장을 위한 multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__srcdirname, "public/download"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "restaurant-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
const defaultPath = "/restaurant";

/**
 * 식당 관련된 컨트롤러
 * @param {express.Express} app
 */
export default function controllerRestaurants(app) {
  // 식당 생성
  app.post(`${defaultPath}/create`, upload.single("image"), create);
  // 식당 조회
  app.get(`${defaultPath}/find`, find);
  // 식당 삭제
  app.delete(`${defaultPath}/delete`, remove);
  // 식당 수정
  app.patch(`${defaultPath}/update`, update);
}
