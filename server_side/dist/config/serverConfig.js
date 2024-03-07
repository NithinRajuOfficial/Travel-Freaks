"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configKeys_1 = require("./configKeys");
const serverConfig = (server) => {
    const startServer = () => {
        const port = parseInt(configKeys_1.configKeys.PORT, 10);
        server.listen(port, "0.0.0.0", () => {
            console.log(`Server Started on ${configKeys_1.configKeys.PORT}`);
        });
    };
    return startServer();
};
exports.default = serverConfig;
