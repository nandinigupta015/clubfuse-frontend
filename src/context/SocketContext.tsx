// src/context/SocketContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, type Socket } from "socket.io-client";

type SocketContextType = Socket | null;

const SocketContext = createContext<SocketContextType>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<SocketContextType>(null);

  useEffect(() => {
    // Connect to backend socket
    const s: Socket = io("http://127.0.0.1:5000", {
      transports: ["websocket"],  // force websocket for stability
      reconnectionAttempts: 5,    // try reconnecting 5 times
      autoConnect: true,
    });

    // Log connection
    s.on("connect", () => console.log("Socket connected:", s.id));
    s.on("disconnect", () => console.log("Socket disconnected"));

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};