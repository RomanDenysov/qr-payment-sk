import { getUserTemplates } from '@/app/actions/dashboard';
import { FadeContainer, FadeDiv } from '@/components/motion/fade';
import { DashboardQrGenerator } from './components/dashboard-qr-generator';
import { TemplatesSidebar } from './components/templates-sidebar';

export default async function GeneratorPage() {
  const templates = await getUserTemplates();

  return (
    <FadeContainer className="space-y-8">
      <FadeDiv>
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Generátor QR kódov
          </h1>
          <p className="text-muted-foreground">
            Vytvorte nový QR kód pre platbu alebo použite existujúcu šablónu
          </p>
        </div>
      </FadeDiv>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* QR Generator Form */}
        <FadeDiv className="lg:col-span-2">
          <DashboardQrGenerator />
        </FadeDiv>

        {/* Templates Sidebar */}
        <FadeDiv>
          <TemplatesSidebar templates={templates.data ?? []} />
        </FadeDiv>
      </div>
    </FadeContainer>
  );
}
