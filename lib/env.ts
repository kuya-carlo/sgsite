export const eventDBName = process.env.EVENT_DBNAME ?? "testevent";
export const subeventDBName = process.env.SUBEVENT_DBNAME ?? "testevent";
export const isOnline =
  process.env.ONLINE_STATUS === "true" ||
  process.env.ONLINE_STATUS === "True" ||
  process.env.ONLINE_STATUS === "TRUE";
