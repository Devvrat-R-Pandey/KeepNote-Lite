// api/notesService.ts
import { api } from "../api/axiosInstance";

export interface Note {
  id: string;
  title: string;
  content: string;
  owner: string;       
  lastModified: string; 
  sharedId?: string;   
}

export type NoteInput = Omit<Note, "id">;

export const getNotes = async (): Promise<Note[]> => {
  const res = await api.get<Note[]>("/notes");
  return res.data;
};

export const getNoteById = async (id: string): Promise<Note> => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export const getNoteBySharedId = async (sharedId: string): Promise<Note | null> => {
  const res = await api.get<Note[]>("/notes", { params: { sharedId } });
  return res.data[0] ?? null;
};

export const createNote = async (note: NoteInput): Promise<Note> => {
  const res = await api.post<Note>("/notes", note);
  return res.data;
};

export const updateNote = async (
  id: string,
  note: Partial<NoteInput>
): Promise<Note> => {
  const res = await api.put<Note>(`/notes/${id}`, note);
  return res.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/notes/${id}`);
};
