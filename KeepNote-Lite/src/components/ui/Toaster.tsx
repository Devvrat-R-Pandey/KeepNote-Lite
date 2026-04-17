import { useUiStore } from "../../store/uiStore";

export const Toaster = () => {
  const { toasts, dismissToast } = useUiStore();
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const typeClasses = {
          success: "alert-success",
          error: "alert-error",
          info: "alert-info",
          warning: "alert-warning"
        };
        const alertClass = typeClasses[t.type] || "alert-info";

        return (
          <div key={t.id} className={`alert ${alertClass} shadow-lg flex w-[300px] pointer-events-auto`}>
            <span className="flex-1 text-sm">{t.message}</span>
            <button onClick={() => dismissToast(t.id)} className="btn btn-ghost btn-xs opacity-70">✕</button>
          </div>
        );
      })}
    </div>
  );
};
