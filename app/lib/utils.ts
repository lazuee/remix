import { useEffect, useState } from "react";

import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function canUseDOM() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
