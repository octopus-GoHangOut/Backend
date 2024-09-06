import express from "express";
import connection from "../db.js";
import { findAccountKey } from "./find.js";

const tableName = "account";

/**
 * 계정 생성 모델
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const create = async (req, res) => {
  try {
    const email = req.body.email; // 이메일 받기
    const id = req.body.id; // 아이디 받기
    const residence = req.body.residence; // 주거지역 받기 (선택)
    const destination = req.body.destination; // 자주가는 여행지

    console.log("\n계정 생성 요청");

    // 이메일 중복 확인
    const emailkeys = await findAccountKey({ email: email });

    if (emailkeys.length !== 0) {
      console.log("이메일이 중복됩니다.");
      res.status(400).json({
        err: { sqlMessage: "Email already exists in database" },
      });
      return;
    }

    // 아이디 중복 확인
    const idKeys = await findAccountKey({ id: id });

    if (idKeys.length !== 0) {
      console.log("아이디가 중복됩니다.");
      res.status(400).json({
        err: { sqlMessage: "Id already exists in database" },
      });
      return;
    }

    // 성공 했을 때 {success: true}
    // 실패 했을 때 {success: false}
    const [results, fields] = await connection.query(
      `INSERT INTO ${tableName} (email, id, residence, destination) VALUES (?, ?, ?, ?)`,
      [email, id, residence, destination]
    );

    res.status(200).json({ results });
    console.log(`${id}(ID) 계정 생성 성공`);
  } catch (err) {
    res.status(400).json({ err });
    console.trace(err);
  }
};

/**
 * 계정 정보 조회 모델
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const find = async (req, res) => {
  try {
    console.log("\n계정 조회 요청");

    const keys = await findAccountKey(req.query);

    if (keys.length === 0) {
      console.log("계정이 존재하지 않음");

      return res.status(400).json({
        err: { sqlMessage: "Account doesn't exist" },
      });
    }

    const [results, fields] = await connection.query(
      "SELECT * FROM " + tableName + " WHERE `key` IN (?)",
      [keys]
    );

    console.log("계정 조회 성공");
    res.status(200).json({ results });
  } catch (err) {
    res.status(400).json({ err });
    console.trace(err);
  }
};

/**
 * 계정 삭제 모델
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const remove = async (req, res) => {
  try {
    console.log("\n계정 삭제 요청");

    const keys = await findAccountKey(req.query);

    if (keys.length === 0) {
      console.log("계정이 존재하지 않음");

      return res.status(400).json({
        err: { sqlMessage: "Account doesn't exist" },
      });
    }

    const [results, fields] = await connection.query(
      "DELETE FROM " + tableName + " WHERE `key` IN (?)",
      [keys]
    );

    console.log("KEY " + keys + " 삭제 성공");
    res.status(200).json({ results });
  } catch (err) {
    res.status(400).json({ err });
    console.trace(err);
  }
};

/**
 * 계정 수정 모델
 * @param {express.Request} req
 * @param {express.Response} res
 */
export const update = async (req, res) => {
  try {
    const body = req.body;

    console.log("\n계정 수정 요청");

    const keys = await findAccountKey(req.query);

    if (keys.length === 0) {
      console.log("계정이 존재하지 않음");
      return res.status(400).json({
        err: { sqlMessage: "Account deosn't exist" },
      });
    }

    // 이메일 중복 확인
    const emailkeys = await findAccountKey({ email: body.email });

    if (emailkeys.length !== 0) {
      console.log("이메일이 중복됩니다.");
      return res.status(400).json({
        err: { sqlMessage: "Email already exists in database" },
      });
    }

    // 아이디 중복 확인
    const idKeys = await findAccountKey({ id: body.id });

    if (idKeys.length !== 0) {
      console.log("아이디가 중복됩니다.");
      return res.status(400).json({
        err: { sqlMessage: "Id already exists in database" },
      });
    }

    let columns = [];
    let values = [];
    const conditions = ["email", "id", "residence", "destination"];
    for (const condition of conditions) {
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
