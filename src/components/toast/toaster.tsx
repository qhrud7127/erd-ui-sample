import {useToast} from "./use-toast.ts";
import {Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport} from "./toast.tsx";


export function Toaster() {
    const { toasts } = useToast();

    return (
        <ToastProvider>
            {toasts.map(function ({
                id,
                title,
                description,
                action,
                layout = 'row',
                ...props
            }) {
                return (
                    <Toast key={id} {...props}>
                        <div
                            className={`grid gap-1${layout === 'column' ? ' w-full' : ''}`}
                        >
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && (
                                <ToastDescription>
                                    {description}
                                </ToastDescription>
                            )}
                            {layout === 'column' ? (
                                <div className="mt-2">{action}</div>
                            ) : null}
                        </div>
                        {layout === 'row' ? action : null}
                        <ToastClose />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
