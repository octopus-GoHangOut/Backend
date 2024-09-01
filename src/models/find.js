import connection from "../db.js";

/**
 * 받아온 쿼리에 따라 sql에 명령을 보내는 함수
 * @param {{email: string, id: string, residence: string, destination: string}} query
 * @returns {number[]} key 반환
 */
export async function findAccountKey(query) {
  let sqlQuery = "SELECT `key` FROM account WHERE ";

  let isUndifined = true;

  const conditions = ["email", "id", "residence", "destination"];
  let values = [];
  let columns = [];

  for (const condition of conditions) {
    if (query[condition] !== undefined) {
      columns.push(condition);
      values.push(query[condition]);
      isUndifined = false;
    }
  }
  sqlQuery += `(${columns}) = (?)`;

  let sqlResults = undefined;

  if (isUndifined) {
    // 아무 쿼리도 없을 때, 모든 계정 반환
    const [results, fields] = await connection.query(
      "SELECT `key` FROM account"
    );
    sqlResults = results;
  } else {
    const [results, fields] = await connection.query(sqlQuery, [values]);
    sqlResults = results;
  }

  let keys = [];
  for (const result of sqlResults) {
    keys.push(result.key);
  }
  return keys;
}

/**
 * 받아온 쿼리에 따라 sql에 명령을 보내는 함수
 * @param {{img: string, name: string, introduction: string, explanation: string, address: string, heart: number}} query
 * @param {string} tableName
 * @returns {number[]} key 반환
 */
export async function findRecommendKey(query, tableName) {
  let sqlQuery = "SELECT `key` FROM " + tableName + " WHERE ";

  let isUndifined = true;

  const conditions = [
    "img",
    "name",
    "introduction",
    "explanation",
    "address",
    "heart",
  ];
  let values = [];
  let columns = [];

  for (const condition of conditions) {
    if (query[condition] !== undefined) {
      columns.push(condition);
      values.push(query[condition]);
      isUndifined = false;
    }
  }
  sqlQuery += `(${columns}) = (?)`;

  let sqlResults = undefined;

  if (isUndifined) {
    // 아무 쿼리도 없을 때, 모든 계정 반환
    const [results, fields] = await connection.query(
      "SELECT `key` FROM " + tableName
    );
    sqlResults = results;
  } else {
    const [results, fields] = await connection.query(sqlQuery, [values]);
    sqlResults = results;
  }

  let keys = [];
  for (const result of sqlResults) {
    keys.push(result.key);
  }
  return keys;
}
