// api/logsService.ts
import { api } from "../api/axiosInstance";

export type LogAction = "CREATE" | "EDIT" | "DELETE" | "SHARE";

export interface Log {
  id: string;
  action: LogAction;
  user: string;      
  noteId: string;
  noteTitle?: string;
  timestamp: string; // ISO date string
}

export type LogInput = Omit<Log, "id">;

export const getLogs = async (): Promise<Log[]> => {
  const res = await api.get<Log[]>("/logs");
  return res.data;
};

export const createLog = async (log: LogInput): Promise<Log> => {
  const res = await api.post<Log>("/logs", log);
  return res.data;
};

export const deleteLog = async (id: string): Promise<void> => {
  await api.delete(`/logs/${id}`);
};