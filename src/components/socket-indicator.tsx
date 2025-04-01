"use client";

import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/components/providers/socket-provider";

export const SocketIndicator = () => {

    const { isConnected } = useSocket();

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