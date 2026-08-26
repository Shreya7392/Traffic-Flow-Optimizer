import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function LiveSync() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const events = new EventSource("http://localhost:3000/api/events");
    const refresh = () => queryClient.invalidateQueries();
    events.addEventListener("traffic-updated", refresh);
    return () => events.close();
  }, [queryClient]);
  return null;
}
