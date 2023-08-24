import { cn } from "@/lib/utils"

interface InterviewsHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string
  text?: string
  children?: React.ReactNode
  showUnderline?: boolean
}

export function InterviewsHeader({
  heading,
  text,
  children,
  className,
  showUnderline = false,
  ...props
}: InterviewsHeaderProps) {
  return (
    <div
      {...props}
      className={cn(
        "my-4 flex flex-col gap-2 px-2 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <h1
          className={cn(
            "font-heading text-3xl md:text-4xl",
            showUnderline && "underline decoration-primary"
          )}
        >
          {heading}
        </h1>
        {text && (
          <p className="text-base text-muted-foreground sm:text-lg">{text}</p>
        )}
      </div>
      {children}
    </div>
  )
}
