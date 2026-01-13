import { cn } from "@/lib/utils";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string;
}

export function CodeBlock({ code, className, ...props }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "font-code bg-muted/50 p-4 rounded-md text-sm overflow-x-auto text-foreground/80",
        className
      )}
      {...props}
    >
      <code>{code}</code>
    </pre>
  );
}
