
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      expand={false}
      closeButton
      richColors
      duration={2000}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

// Re-export toast with custom default options
import { toast as sonnerToast } from "sonner"

export const toast = {
  ...sonnerToast,
  success: (message: string, options = {}) => 
    sonnerToast.success(message, { duration: 2000, ...options }),
  error: (message: string, options = {}) => 
    sonnerToast.error(message, { duration: 2000, ...options }),
  info: (message: string, options = {}) => 
    sonnerToast.info(message, { duration: 2000, ...options }),
  warning: (message: string, options = {}) => 
    sonnerToast.warning(message, { duration: 2000, ...options }),
}
