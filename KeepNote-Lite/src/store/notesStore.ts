// store/notesStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  type Note,
  type NoteInput,
} from "../services/notesService";
import { useLogStore } from "./logStore";
import { useAuthStore } from "./authStore";
import { useUiStore } from "./uiStore";

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;

  fetchNotes: () => Promise<void>;
  addNote: (input: Pick<NoteInput, "title" | "content">) => Promise<void>;
  editNote: (id: string, input: Pick<NoteInput, "title" | "content">) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
  shareNote: (id: string) => Promise<string>;
}

export const useNotesStore = create<NotesState>()(
  devtools(
    (set, get) => ({
      notes: [],
      loading: false,
      error: null,

      // ── Fetch all notes ─────────────────────────────────────────────────
      fetchNotes: async () => {
        set({ loading: true, error: null }, false, "notes/fetchNotes/pending");
        try {
          const data = await getNotes();
          set({ notes: data, loading: false }, false, "notes/fetchNotes/fulfilled");
        } catch {
          set(
            { error: "Server is unavailable. Please check your connection or try again later.", loading: false, notes: [] },
            false,
            "notes/fetchNotes/rejected"
          );
        }
      },

      // ── Create a note — optimistic UI pattern ────────────────────────────
      addNote: async ({ title, content }) => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        try {
          const newNote = await createNote({
            title,
            content,
            owner: user.email,
            lastModified: new Date().toISOString(),
          });

          // Append without re-fetching
          set(
            (s) => ({ notes: [...s.notes, newNote] }),
            false,
            "notes/addNote"
          );

          // Toast feedback
          useUiStore.getState().showToast(`"${newNote.title}" created`, "success");

          // Log action
          await useLogStore.getState().addLog({
            action: "CREATE",
            user: user.email,
            noteId: newNote.id,
            noteTitle: newNote.title,
            timestamp: new Date().toISOString(),
          });
        } catch {
          useUiStore.getState().showToast("Failed to create note", "error");
        }
      },

      // ── Update a note — replace in-place ─────────────────────────────────
      editNote: async (id, { title, content }) => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        const existing = get().notes.find((n) => n.id === id);

        try {
          const updated = await updateNote(id, {
            title,
            content,
            owner: existing?.owner ?? user.email,
            lastModified: new Date().toISOString(),
          });

          set(
            (s) => ({
              notes: s.notes.map((n) => (n.id === id ? updated : n)),
            }),
            false,
            "notes/editNote"
          );

          useUiStore.getState().showToast(`"${updated.title}" updated`, "success");

          await useLogStore.getState().addLog({
            action: "EDIT",
            user: user.email,
            noteId: id,
            noteTitle: updated.title,
            timestamp: new Date().toISOString(),
          });
        } catch {
          useUiStore.getState().showToast("Failed to update note", "error");
        }
      },

      // ── Delete a note — filter out immediately ────────────────────────────
      removeNote: async (id) => {
        const user = useAuthStore.getState().user;
        const noteToDelete = get().notes.find((n) => n.id === id);

        try {
          await deleteNote(id);

          set(
            (s) => ({ notes: s.notes.filter((n) => n.id !== id) }),
            false,
            "notes/removeNote"
          );

          useUiStore.getState().showToast(
            `"${noteToDelete?.title ?? "Note"}" deleted`,
            "success"
          );

          if (user) {
            await useLogStore.getState().addLog({
              action: "DELETE",
              user: user.email,
              noteId: id,
              noteTitle: noteToDelete?.title,
              timestamp: new Date().toISOString(),
            });
          }
        } catch {
          useUiStore.getState().showToast("Failed to delete note", "error");
        }
      },

      // ── Share note — generate/reuse link ──────────────────────────────────
      shareNote: async (id) => {
        const user = useAuthStore.getState().user;
        const note = get().notes.find((n) => n.id === id);
        if (!note || !user) return "";

        let sharedId = note.sharedId;

        try {
          if (!sharedId) {
            // Short 10-char base-36 ID  →  e.g. /shared/k9z3m1xp2q
            sharedId =
              Math.random().toString(36).slice(2, 7) +
              Date.now().toString(36).slice(-5);
            const updated = await updateNote(id, { ...note, sharedId });
            set(
              (s) => ({
                notes: s.notes.map((n) => (n.id === id ? updated : n)),
              }),
              false,
              "notes/shareNote"
            );
          }

          await useLogStore.getState().addLog({
            action: "SHARE",
            user: user.email,
            noteId: id,
            noteTitle: note.title,
            timestamp: new Date().toISOString(),
          });

          const url = `${window.location.origin}/shared/${sharedId}`;
          return url;
        } catch {
          useUiStore.getState().showToast("Failed to generate share link", "error");
          return "";
        }
      },
    }),
    { name: "NotesStore" }
  )
);
