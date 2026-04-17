// store/uiStore.ts
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

// ─── Toast ───────────────────────────────────────────────────────────────────
export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// ─── Note Modal ───────────────────────────────────────────────────────────────
export type ModalMode = "create" | "edit" | "view" | "delete" | null;

// ─── Theme ────────────────────────────────────────────────────────────────────
export type Theme = "light" | "dark";

// ─── State shape ─────────────────────────────────────────────────────────────
interface UiState {
  // theme
  theme: Theme;
  toggleTheme: () => void;

  // toasts
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;

  // note modal — one modal open at a time, tracked globally
  modalMode: ModalMode;
  activeNoteId: string | null;
  openModal: (mode: ModalMode, noteId?: string | null) => void;
  closeModal: () => void;

  // share urls per note (noteId → shareUrl)
  shareUrls: Record<string, string>;
  setShareUrl: (noteId: string, url: string) => void;
  clearShareUrl: (noteId: string) => void;
}

let toastIdCounter = 0;
const nextId = () => String(++toastIdCounter);

export const useUiStore = create<UiState>()(
  devtools(
    persist(
      (set, get) => ({
        // ── theme ──────────────────────────────────────────────────────────
        theme: "light",
        toggleTheme: () => {
          const next: Theme = get().theme === "light" ? "dark" : "light";
          document.documentElement.setAttribute("data-theme", next);
          set({ theme: next }, false, "ui/toggleTheme");
        },

        // ── toasts ────────────────────────────────────────────────────────
        toasts: [],
        showToast: (message, type = "success") => {
          const id = nextId();
          set(
            (s) => ({ toasts: [...s.toasts, { id, message, type }] }),
            false,
            "ui/showToast"
          );
          // auto-dismiss after 3 s
          setTimeout(() => get().dismissToast(id), 3000);
        },
        dismissToast: (id) =>
          set(
            (s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }),
            false,
            "ui/dismissToast"
          ),

        // ── note modal ────────────────────────────────────────────────────
        modalMode: null,
        activeNoteId: null,
        openModal: (mode, noteId = null) =>
          set(
            { modalMode: mode, activeNoteId: noteId ?? null },
            false,
            "ui/openModal"
          ),
        closeModal: () =>
          set(
            { modalMode: null, activeNoteId: null },
            false,
            "ui/closeModal"
          ),

        // ── share urls ────────────────────────────────────────────────────
        shareUrls: {},
        setShareUrl: (noteId, url) =>
          set(
            (s) => ({ shareUrls: { ...s.shareUrls, [noteId]: url } }),
            false,
            "ui/setShareUrl"
          ),
        clearShareUrl: (noteId) =>
          set(
            (s) => {
              const next = { ...s.shareUrls };
              delete next[noteId];
              return { shareUrls: next };
            },
            false,
            "ui/clearShareUrl"
          ),
      }),
      {
        name: "ui-storage",
        // Only persist theme — modal & toast state is ephemeral
        partialize: (s) => ({ theme: s.theme }),
      }
    ),
    { name: "UiStore" }
  )
);
