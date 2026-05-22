import { TopNavBar } from "./TopNavBar";
import { BottomNavBar } from "./BottomNavBar";
import { ScrollTrackerProvider } from "./ScrollTracker";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <ScrollTrackerProvider>
      <TopNavBar />
      {children}
      <BottomNavBar />
    </ScrollTrackerProvider>
  );
}
