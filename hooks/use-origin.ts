import { useEffect, useState } from "react";

export const useOrigin = () => {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  if (!isMounted) return "";

  return origin;
};
