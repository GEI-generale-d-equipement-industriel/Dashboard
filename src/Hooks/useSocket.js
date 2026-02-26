import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Replace this with your backend WebSocket server URL
// const SOCKET_SERVER_URL = process.env.REACT_APP_API_BASE_URL||"/api"; 

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const url = process.env.REACT_APP_API_BASE_URL || "/api";
  useEffect(() => {
    const socketInstance = io("https://bemodel.tn", {
      path: '/socket.io',
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      secure: true, // Changed to true for HTTPS/WSS
      
      withCredentials: true // Ensures cookies are sent
    });
  
    socketInstance.on("connect", () => {
      // console.log("Connected to WebSocket");
      setIsConnected(true);
    });  

    socketInstance.on("disconnect", () => {  
      // console.log("Disconnected from WebSocket");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected };
};
