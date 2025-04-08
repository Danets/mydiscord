"use client";

import { Badge } from "@/components/ui/badge";
import { useWebSocketConnectionHook } from "../../hooks/use-socket";

export const SocketIndicator = () => {

    const { isConnected } = useWebSocketConnectionHook();

    if (!isConnected) {
        return (
            <Badge variant="outline" className="bg-yellow-600 text-white border-none">
                Disconnected
            </Badge>
        )
    }

    return (
        <Badge variant="outline" className="bg-green-600 text-white border-none">
            Connected
        </Badge>
    )
}