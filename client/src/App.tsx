import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import { AuthPage } from "@/pages/auth";
import { AdminLogin } from "@/pages/admin-login";
import { AdminDashboard } from "@/pages/admin-dashboard";
import { AdminBypass } from "@/pages/admin-bypass";
import { ClientDashboard } from "@/pages/client-dashboard";
import { DevAdminDashboard } from "@/pages/dev-admin-dashboard";
import { VehicleInventory } from "@/pages/vehicle-inventory";
import { PropertyInventory } from "@/pages/property-inventory";
import PanicSystem from "@/pages/panic-system";
import CloakingControls from "@/pages/cloaking-controls";
import SecureMessaging from "@/pages/secure-messaging";
import RealTimeBooking from "@/pages/real-time-booking";
import PersonalSecurity from "@/pages/personal-security";
import ConciergeIntelligence from "@/pages/concierge-intelligence";
import MultiServiceBooking from "@/pages/multi-service-booking";
import MobilePage from "@/pages/mobile";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import Contact from "@/pages/contact";
import PersonnelLogin from "@/pages/personnel-login";
import PersonnelDashboard from "@/pages/personnel-dashboard";
import VettingDashboard from "@/pages/vetting-dashboard";
import AdminVettingManagement from "@/pages/admin-vetting-management";
import VettingProcess from "@/pages/vetting-process";
import SurveyResults from "@/pages/survey-results";
import Checkout from "@/pages/checkout";
import PaymentSuccess from "@/pages/payment-success";
import InvestorLogin from "@/pages/investor-login";
import BusinessPlan from "@/pages/business-plan";
import Careers from "@/pages/careers";
import HRDashboard from "@/pages/hr-dashboard";
import InvestmentInterest from "@/pages/investment-interest";
import AdminBusinessDashboard from "@/pages/admin-business-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/login" component={AuthPage} />
      <Route path="/admin">
        <AdminLogin onSuccess={() => window.location.href = '/admin/dashboard'} />
      </Route>
      <Route path="/admin/bypass" component={AdminBypass} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/dev-admin/dashboard" component={DevAdminDashboard} />
      <Route path="/client/dashboard" component={ClientDashboard} />
      <Route path="/vehicles" component={VehicleInventory} />
      <Route path="/properties" component={PropertyInventory} />
      <Route path="/panic-system" component={PanicSystem} />
      <Route path="/cloaking-controls" component={CloakingControls} />
      <Route path="/secure-messaging" component={SecureMessaging} />
      <Route path="/real-time-booking" component={RealTimeBooking} />
      <Route path="/personal-security" component={PersonalSecurity} />
      <Route path="/concierge-intelligence" component={ConciergeIntelligence} />
      <Route path="/multi-service-booking" component={MultiServiceBooking} />
      <Route path="/mobile" component={MobilePage} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/contact" component={Contact} />
      <Route path="/personnel/login">
        <PersonnelLogin onSuccess={() => window.location.href = '/personnel/dashboard'} />
      </Route>
      <Route path="/personnel/dashboard" component={PersonnelDashboard} />
      <Route path="/vetting/dashboard" component={VettingDashboard} />
      <Route path="/admin/vetting" component={AdminVettingManagement} />
      <Route path="/vetting-process" component={VettingProcess} />
      <Route path="/survey-results" component={SurveyResults} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/investor-login" component={InvestorLogin} />
      <Route path="/business-plan" component={BusinessPlan} />
      <Route path="/careers" component={Careers} />
      <Route path="/hr/dashboard" component={HRDashboard} />
      <Route path="/investment-interest" component={InvestmentInterest} />
      <Route path="/admin/business-dashboard" component={AdminBusinessDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
