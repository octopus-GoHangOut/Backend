import express from "express";
import multer from "multer";
import path from "path";
import { __srcdirname } from "../fs.js";
import { create, remove, update, find } from "../models/places.js";

// 이미지 저장을 위한 multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__srcdirname, "public/download"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "place-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
const defaultPath = "/place";

/**
 * 장소와 관련된 컨트롤러
 * @param {express.Express} app
 */
export default function controllerPlaces(app) {
  // 장소 생성
  app.post(`${defaultPath}/create`, upload.single("image"), create);
  // 장소 조회
  app.get(`${defaultPath}/find`, find);
  // 장소 삭제
  app.delete(`${defaultPath}/delete`, remove);
  // 장소 수정
  app.patch(`${defaultPath}/update`, update);
}
