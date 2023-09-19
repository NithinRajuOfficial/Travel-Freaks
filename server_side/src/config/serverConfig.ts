import { Server } from "http";
import { configKeys } from "./configKeys";

const serverConfig = (server: Server) => {
  const startServer = () => {
    const port = parseInt(configKeys.PORT, 10);

    server.listen(port, "0.0.0.0", () => {
      console.log(`Server Started on ${configKeys.PORT}`);
    });
  };
  return startServer();
};

export default serverConfig;
