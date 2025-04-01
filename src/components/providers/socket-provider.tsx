"use client";

import { io } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";

type SocketContextType = {
    socket: any | null;
    isConnected?: boolean;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socketData, setSocketData] = useState<SocketContextType>({
        socket: null,
        isConnected: false,
    });

    useEffect(() => {
        const socket = new (io as any)(process.env.NEXT_PUBLIC_API_URL as string, {
            path: "/api/socket/io",
            addTrailingSlash: false,
        });

        socket.on("connect", () => {
            setSocketData((prev) => ({ ...prev, isConnected: true }));
        });

        socket.on("disconnect", () => {
            setSocketData((prev) => ({ ...prev, isConnected: false }));
        });

        setSocketData({ socket });

        return () => {
            socket.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={socketData}>{children}</SocketContext.Provider>;
};