import express from "express";
import connection from "../db.js";
import { findRecommendKey } from "./find.js";
import fs from "fs";
import { __srcdirname } from "../fs.js";

const tableName = "places";

/**
 * 장소 데이터 생성 모델
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const create = async (req, res) => {
  const body = req.body;

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, err: { sqlMessage: "Image upload failed" } });
    }
    const imgPath = `/download/${req.file.filename}`;

    // uid 필드가 올바르게 전달되는지 확인
    if (!body.uid) {
      return res
        .status(400)
        .json({ success: false, err: { sqlMessage: "UID is missing" } });
    }

    const [results, _] = await connection.query(
      "INSERT INTO " +
        tableName +
        " (img, `name`, introduction, explanation, `address`, uid) VALUES (?, ?, ?, ?, ?, ?)",
      [
        imgPath,
        body.name,
        body.introduction,
        body.explanation,
        body.address,
        body.uid,
      ]
    );

    console.log("\n" + body.name + " 장소 데이터 생성 완료");

    res.status(200).json({ results });
  } catch (err) {
    // 실패한 이미지 삭제
    fs.unlink(__srcdirname + "/public/download/" + req.file.filename, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err.message}`);
      } else {
        console.log("Failed image: " + req.file.filename);
        console.log("실패한 요청의 이미지가 성공적으로 삭제되었습니다.");
      }
    });

    res.status(400).json({ err });
    console.trace(err);
  }
};

/**
 * 장소 조회 모델
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const find = async (req, res) => {
  try {
    console.log("\n장소 조회 요청");

    const keys = await findRecommendKey(req.query, "places");

    if (keys.length === 0) {
      console.log("장소가 존재하지 않음");

      return res.status(400).json({
        err: { sqlMessage: "Place doesn't exist" },
      });
    }

    const [results, _] = await connection.query(
      "SELECT * FROM " + tableName + " WHERE `key` IN (?)",
      [keys]
    );

    console.log("장소 조회 성공");
    console.log(keys);
    res.status(200).json({ results });
  } catch (err) {
    res.status(400).json({ err });
    console.trace(err);
  }
};

/**
 * 장소 삭제 모델
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const remove = async (req, res) => {
  try {
    console.log("\n장소 삭제 요청");

    const keys = await findRecommendKey(req.query, "places");

    if (keys.length === 0) {
      console.log("장소가 존재하지 않음");

      return res.status(400).json({
        err: { sqlMessage: "Place doesn't exist" },
      });
    }

    // 이미지 파일 이름 가져오기
    const [imgResults, _] = await connection.query(
      "SELECT img FROM " + tableName + " WHERE `key` IN (?)",
      [keys]
    );

    const [results, fields] = await connection.query(
      "DELETE FROM " + tableName + " WHERE `key` IN (?)",
      [keys]
    );

    console.log("KEY " + keys + " 삭제 성공");

    // 로컬 이미지 파일 삭제
    imgResults.forEach((img) => {
      const image = img.img;

      fs.unlink(__srcdirname + "/public" + image, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err.message}`);
        } else {
          console.log(image + " 파일이 성공적으로 삭제되었습니다.");
        }
      });
    });

    res.status(200).json({ results });
  } catch (err) {
    res.status(400).json({ err });
    console.trace(err);
  }
};

/**
 * 장소 수정 모델
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const update = async (req, res) => {
  try {
    const body = req.body;

    console.log("\n장소 수정 요청");

    const keys = await findRecommendKey(req.query, "places");

    if (keys.length === 0) {
      console.log("장소가 존재하지 않음");
      return res.status(400).json({
        err: { sqlMessage: "Place deosn't exist" },
      });
    }

    let columns = [];
    let values = [];
    const conditions = [
      "img",
      "name",
      "introduction",
      "explanation",
      "address",
      "heart",
    ];
    for (const condition of conditions) {
      console.log(req.body.condition);
      if (body[condition] !== undefined) {
        columns.push(condition + "=?");
        values.push(body[condition]);
      }
    }

    const [results, _] = await connection.query(
      "UPDATE " + tableName + " SET " + columns + " WHERE `key` IN (?)",
      [...values, keys]
    );

    res.status(200).json({ results });
  } catch (err) {
    res.status(400).json({ err });
    console.trace(err);
  }
};
