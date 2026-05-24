import { NavChrome } from "./NavChrome";
import { ScrollTrackerProvider } from "./ScrollTracker";

interface DashboardShellProps {
  children: React.ReactNode;
  hideMobileChrome?: boolean;
}

export function DashboardShell({ children, hideMobileChrome }: DashboardShellProps) {
  return (
    <ScrollTrackerProvider>
      <NavChrome hideMobileChrome={hideMobileChrome} />
      {children}
    </ScrollTrackerProvider>
  );
}
