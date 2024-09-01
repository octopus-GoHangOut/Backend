import express from "express";
import { create, find, remove, update } from "../models/account.js";

const defaultPath = "/account";

/** @param {express.Express} app */
export default function controllerAccount(app) {
  // POST: 계정 생성 - /account/create
  app.post(`${defaultPath}/create`, create);

  // GET: 계정 조회
  // /account/find?email={계정 이메일} - 이메일을 이용해서 계정 조회
  // /account/find?id={계정 아이디} - 아이디를 이용해서 계정 조회
  // /account/find?residence={계정 주거지} - 주거지를 이용해서 계정 조회
  // /account/find?destination={계정 자주간 여행지} - 자주간 여행지를 이용해서 계정 조회
  // /account/find - 모든 계정 조회
  // email이나 id를 동시에 검색 가능해짐!!!!!
  app.get(`${defaultPath}/find`, find);

  // DELETE: 계정 삭제
  // 위에 find와 마찬가지인 방식으로 사용 가능
  app.delete(`${defaultPath}/delete`, remove);

  // PATCH: 계정 수정
  app.patch(`${defaultPath}/update`, update);
}
