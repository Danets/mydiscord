import { Server, Channel, ChannelType } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "createChannel"
  | "editChannel"
  | "deleteChannel"
  | "invitePeople"
  | "manageMembers"
  | "editServer"
  | "deleteServer"
  | "leaveServer"
  | "messageFile";

interface ModalData {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
  apiUrl?: string;
  query?: Record<string, any> | string;
}
interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
