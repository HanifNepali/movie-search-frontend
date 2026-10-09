const EmptyState = ({ children }: { children: React.ReactNode }) => {
  return <section className="flex flex-col gap-2">{children}</section>;
};

const Title = ({ children }: { children: React.ReactNode }) => {
  return <h3 className="text-lg font-medium text-foreground">{children}</h3>;
};

const Description = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sm text-muted">{children}</p>;
};

EmptyState.Title = Title;
EmptyState.Description = Description;

/**
 * Composition pattern: the caller decides the content, the component owns
 * the layout and styling.
 *
 * <EmptyState>
 *   <EmptyState.Title>…</EmptyState.Title>
 *   <EmptyState.Description>…</EmptyState.Description>
 * </EmptyState>
 */

export { EmptyState };
