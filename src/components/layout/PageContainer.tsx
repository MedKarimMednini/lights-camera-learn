interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "7xl" | "full";
}

export function PageContainer({ 
  children, 
  className = "",
  maxWidth = "7xl"
}: PageContainerProps) {
  
  const maxWidthClasses = {
    "sm": "max-w-sm",
    "md": "max-w-md",
    "lg": "max-w-lg",
    "xl": "max-w-xl",
    "7xl": "max-w-7xl",
    "full": "max-w-full"
  };

  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20 ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
}
