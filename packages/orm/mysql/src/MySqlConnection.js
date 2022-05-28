import { Connection } from "@fortles/model";
import mysql from "mysql2";
export default class MySqlConnection extends Connection {
    connection;
    constructor(config) {
        super();
        this.connection = mysql.createPool(config).promise();
    }
    async execute(query, data = null) {
        return await this.connection.execute(query, data);
    }
}
//# sourceMappingURL=MySqlConnection.js.map