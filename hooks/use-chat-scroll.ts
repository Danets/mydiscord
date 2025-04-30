import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);

  // Handle infinite scroll
  useEffect(() => {
    const chatElement = chatRef?.current;

    if (!chatElement) return;

    const handleScroll = () => {
      if (chatElement.scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    chatElement.addEventListener("scroll", handleScroll);

    return () => chatElement.removeEventListener("scroll", handleScroll);
  }, [chatRef, shouldLoadMore, loadMore]);

  // Handle auto-scroll
  useEffect(() => {
    const chatElement = chatRef?.current;
    const bottomDiv = bottomRef?.current;

    if (!chatElement || !bottomDiv) return;

    const shouldAutoScroll = () => {
      if (bottomDiv && !hasInitialized) {
        setHasInitialized(true);
        return true;
      }
      const distanceToBottom =
        chatElement.scrollHeight -
        (chatElement.scrollTop + chatElement.clientHeight);
      return distanceToBottom <= 100;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [chatRef, bottomRef, count, hasInitialized]);
};
