import { createConnection } from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await init();
async function init() {
  const connection = await createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "roommeet",
  });

  await connection.connect();

  let tables = await connection.query("SHOW TABLES");
  tables = tables[0];
  const excepts = [
"connected_accounts",
"failed_jobs",
"migrations",
"password_reset_tokens",
"personal_access_tokens",
"sessions",
  ];

  let databaseStructures = [];
  for (let index = 0; index < tables.length; index++) {
    const row = tables[index];

    const tableName = Object.values(row)[0];

    if (excepts.includes(tableName)) continue;

    const columns = await connection.query(
      `SHOW FULL COLUMNS FROM ${tableName}`
    );

    let data = [];

    columns[0].forEach((column) => {
      let obj = {
        name: column.Field,
        type: column.Type,
      };

      if (column?.Comment) {
        obj.comment = column.Comment;
      }
      data.push(obj);
    });
    databaseStructures.push({
      tableName,
      columns: data,
    });
  }

  fs.writeFileSync(
    path.join(__dirname, ".scheme.json"),
    JSON.stringify(databaseStructures, null, 2)
  );
  await connection.end();
  return false;
}
