import { AppHeader } from '../components/app-header';
import { DashboardContainer } from '../components/dashboard-container';
import { PopularTemplates } from './components/popular-templates';
import { QuickActions } from './components/quick-actions';
import { QuickStats } from './components/quick-stats';
import { RecentActivity } from './components/recent-activity';

export default function OverviewPage() {
  return (
    <>
      <AppHeader breadcrumbs={[{ label: 'Overview', href: '/overview' }]}>
        {/* <div className="ml-auto flex items-center gap-2">
          <Button variant="outline">
            <PlusIcon className="size-4" />
            Generate QR Code
          </Button>
        </div> */}
      </AppHeader>
      <DashboardContainer className="flex flex-col gap-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="font-bold text-3xl tracking-tight">Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your QR payment system.
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Quick Actions */}
        <QuickActions />

        {/* Two Column Layout for Templates and Activity */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <PopularTemplates />
          <RecentActivity />
        </div>
      </DashboardContainer>
    </>
  );
}
