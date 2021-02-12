export const config = {
  streamUrl: import.meta.env.VITE_STREAM_URL || "",
  eventsUrl: import.meta.env.VITE_EVENTS_URL || "",
  wsUrl: import.meta.env.VITE_WS_URL || "",
  historyUrl: import.meta.env.VITE_HISTORY_URL || "",
  userIdle: 10000,
  messageDelay: 50,
};
