import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ShellRoot } from './components/shell/ShellRoot';
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ClinicLayout } from './components/layout/ClinicLayout';
import { Home } from './pages/Home';
import { PatientLanding } from './pages/PatientLanding';
import { PatientAssessment } from './pages/PatientAssessment';
import { SymptomChecker } from './pages/SymptomChecker';
import { AskAI } from './pages/AskAI';
import { ClinicProfile } from './pages/ClinicProfile';
import { MensTrivia } from './pages/MensTrivia';
import { ClinicLanding } from './pages/ClinicLanding';
import { ClinicApply } from './pages/ClinicApply';
import { ClinicRegister } from './pages/ClinicRegister';
import { ClinicLogin } from './pages/ClinicLogin';
import { Marketplace } from './pages/Marketplace';
import { MarketplaceCategory } from './pages/MarketplaceCategory';
import { MarketplaceClinics } from './pages/MarketplaceClinics';
import { MarketplaceEquipment } from './pages/MarketplaceEquipment';
import { MarketplaceDiagnostics } from './pages/MarketplaceDiagnostics';
import { MarketplaceDigitalHealth } from './pages/MarketplaceDigitalHealth';
import { MarketplaceHomeGym } from './pages/MarketplaceHomeGym';
import { MarketplaceHealthTech } from './pages/MarketplaceHealthTech';
import { ProductDetail } from './pages/ProductDetail';
import { Workforce } from './pages/Workforce';
import { WorkforceJobs } from './pages/WorkforceJobs';
import { WorkforceProfile } from './pages/WorkforceProfile';
import { WorkforceApply } from './pages/WorkforceApply';
import { WorkforceDashboard } from './pages/WorkforceDashboard';
import { Directory } from './pages/Directory';
import { BlogIndex } from './pages/BlogIndex';
import { BlogDetail } from './pages/BlogDetail';
import { VisualIntelligence } from './pages/VisualIntelligence';
import { Contact } from './pages/Contact';
import { Practitioners } from './pages/Practitioners';
import { PractitionerOnboarding } from './pages/PractitionerOnboarding';
import { PractitionerProfile } from './pages/PractitionerProfile';
import { CommandCenter } from './pages/admin/CommandCenter';
import { CRM } from './pages/admin/CRM';
import { Outreacher } from './pages/admin/Outreacher';
import { DirectoryManager } from './pages/admin/DirectoryManager';
import { LaunchDashboard } from './pages/admin/LaunchDashboard';
import { MCPDashboard } from './pages/admin/MCPDashboard';
import { ClinicOverview } from './pages/ClinicOverview';
import { ClinicLeads } from './pages/ClinicLeads';
import { ClinicPipeline } from './pages/ClinicPipeline';
import { ClinicWorkforce } from './pages/ClinicWorkforce';
import { ClinicActivate } from './pages/ClinicActivate';
import { ClinicMarketplace } from './pages/ClinicMarketplace';
import { ClinicIntelligence } from './pages/ClinicIntelligence';
import { ClinicBilling } from './pages/ClinicBilling';
import { ClinicSettings } from './pages/ClinicSettings';
import { ClinicHelp } from './pages/ClinicHelp';
import { NotFound } from './pages/NotFound';
import { PatientSupport } from './pages/support/PatientSupport';
import { ClinicSupport } from './pages/support/ClinicSupport';
import { VendorSupport } from './pages/support/VendorSupport';
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy';
import { TermsOfService } from './pages/legal/TermsOfService';
import { SecurityStandards } from './pages/legal/SecurityStandards';
import { SystemStatus } from './pages/SystemStatus';
import { Platform } from './pages/Platform';

export default function App() {
  return (
    <BrowserRouter>
      <ShellRoot>
        <Routes>
          {/* Public Routes with Navbar/Footer */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="patient" element={<PatientLanding />} />
            <Route path="symptom-checker" element={<SymptomChecker />} />
            <Route path="ask-ai" element={<AskAI />} />
            <Route path="clinics" element={<ClinicLanding />} />
            <Route path="clinics/:id" element={<ClinicProfile />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="marketplace/clinics" element={<MarketplaceClinics />} />
            <Route path="marketplace/equipment" element={<MarketplaceEquipment />} />
            <Route path="marketplace/diagnostics" element={<MarketplaceDiagnostics />} />
            <Route path="marketplace/digital-health" element={<MarketplaceDigitalHealth />} />
            <Route path="marketplace/home-gym" element={<MarketplaceHomeGym />} />
            <Route path="marketplace/health-tech" element={<MarketplaceHealthTech />} />
            <Route path="marketplace/:category" element={<MarketplaceCategory />} />
            <Route path="marketplace/product/:id" element={<ProductDetail />} />
            <Route path="workforce" element={<Workforce />} />
            <Route path="workforce/jobs" element={<WorkforceJobs />} />
            <Route path="practitioners" element={<Practitioners />} />
            <Route path="directory" element={<Directory />} />
            <Route path="blog" element={<BlogIndex />} />
            <Route path="blog/:id" element={<BlogDetail />} />
            <Route path="visual-intelligence" element={<VisualIntelligence />} />
            <Route path="contact" element={<Contact />} />
            <Route path="mens-trivia" element={<MensTrivia />} />
            <Route path="support/patient" element={<PatientSupport />} />
            <Route path="support/clinic" element={<ClinicSupport />} />
            <Route path="support/vendor" element={<VendorSupport />} />
            <Route path="status" element={<SystemStatus />} />
            <Route path="platform" element={<Platform />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="security" element={<SecurityStandards />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Standalone Routes without global Navbar/Footer */}
          <Route path="/patient/assessment" element={<PatientAssessment />} />
          <Route path="/clinics/apply" element={<ClinicApply />} />
          <Route path="/auth/register-clinic" element={<ClinicRegister />} />
          <Route path="/auth/clinic-login" element={<ClinicLogin />} />
          <Route path="/workforce/profile" element={<WorkforceProfile />} />
          <Route path="/workforce/apply/:id" element={<WorkforceApply />} />
          <Route path="/workforce/dashboard" element={<WorkforceDashboard />} />
          <Route path="/practitioners/onboarding" element={<PractitionerOnboarding />} />
          <Route path="/practitioners/profile" element={<PractitionerProfile />} />
          
          {/* Clinic Deep Links */}
          <Route path="/clinic/workforce" element={<Navigate to="/dashboard/workforce" replace />} />
          <Route path="/clinic/activate" element={<Navigate to="/dashboard/activate" replace />} />

          {/* Clinic Routes with ClinicLayout */}
          <Route path="/dashboard" element={<ClinicLayout />}>
            <Route index element={<ClinicOverview />} />
            <Route path="activate" element={<ClinicActivate />} />
            <Route path="leads" element={<ClinicLeads />} />
            <Route path="pipeline" element={<ClinicPipeline />} />
            <Route path="workforce" element={<ClinicWorkforce />} />
            <Route path="marketplace" element={<ClinicMarketplace />} />
            <Route path="intelligence" element={<ClinicIntelligence />} />
            <Route path="billing" element={<ClinicBilling />} />
            <Route path="settings" element={<ClinicSettings />} />
            <Route path="help" element={<ClinicHelp />} />
          </Route>

          {/* Admin Routes with AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<CommandCenter />} />
            <Route path="crm" element={<CRM />} />
            <Route path="outreacher" element={<Outreacher />} />
            <Route path="directory" element={<DirectoryManager />} />
            <Route path="launch" element={<LaunchDashboard />} />
            <Route path="mcp" element={<MCPDashboard />} />
          </Route>
        </Routes>
      </ShellRoot>
    </BrowserRouter>
  );
}






