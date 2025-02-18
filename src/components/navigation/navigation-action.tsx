"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "../../../hooks/use-modal-store";

export const NavigationAction = () => {
    const { onOpen } = useModal();

    return (
        <div>
            <ActionTooltip side="right" align="center" label="Create a new server">
                <button className="group flex items-center" onClick={() => onOpen("createServer")}>
                    <div className="flex justify-center items-center w-12 h-12 mx-3 rounded-[24px] group-hover:rounded-[16px] overflow-hidden transition-all bg-background dark:bg-neutral-700 group-hover:bg-emerald-700">
                        <Plus className="text-emerald-500 transition group-hover:text-white" size={25} />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    )
}
