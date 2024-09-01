import mysql from "mysql2/promise"; // 기본 기능을 사용하려면 mysql2을 가져온다.

const connection = await mysql.createConnection({
  host: "localhost", // 호스트 이름
  user: "root", // 유저 이름
  password: "Password", // 유저 비밀번호
  database: "gohangout", // 데이터베이스 이름
  port: 3306, // 포트
});

export default connection;
