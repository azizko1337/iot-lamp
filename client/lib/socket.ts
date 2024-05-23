import io from "socket.io-client";

const socket = io(process.env.API_URL || "http://localhost:5000");

export default socket.connect();
