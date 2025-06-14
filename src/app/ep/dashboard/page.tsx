import DashboardLayout from '@/components/DashboardLayout';
import DashboardCardSection from '@/components/EPDashboard/DashboardCardSection';
import DashboardAuctionTable from '@/components/EPDashboard/DashboardAuctionTable';

export default function EPDashboard() {
  return (
    <DashboardLayout>
      <DashboardCardSection />
      <DashboardAuctionTable />
    </DashboardLayout>
  );
}
