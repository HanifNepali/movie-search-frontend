"use client";

import { useEffect, useState } from "react";

export interface LiveAnnouncementProps {
  message: string;
}

export function LiveAnnouncement({ message }: LiveAnnouncementProps) {
  const [announced, setAnnounced] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => setAnnounced(message), 300);
    return () => clearTimeout(timeout);
  }, [message]);

  return (
    <div role="status" className="sr-only">
      {announced}
    </div>
  );
}
