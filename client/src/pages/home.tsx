import { useState } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import GlobalPresenceSection from "@/components/global-presence-section";
import ClienteleSection from "@/components/clientele-section";
import LuxuryExperienceSection from "@/components/luxury-experience-section";
import { QRCodeSection } from "@/components/qr-code-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import FormSelector from "@/components/forms/form-selector";
import ClientIntakeForm from "@/components/forms/client-intake-form";
import SubcontractorForm from "@/components/forms/subcontractor-form";
import RegionalPartnerForm from "@/components/forms/regional-partner-form";

export default function Home() {
  const [showSelector, setShowSelector] = useState(false);
  const [activeForm, setActiveForm] = useState<'client' | 'subcontractor' | 'partner' | null>(null);

  const openFormSelector = () => {
    setShowSelector(true);
  };

  const closeAllForms = () => {
    setShowSelector(false);
    setActiveForm(null);
  };

  const handleFormSelect = (formType: 'client' | 'subcontractor' | 'partner') => {
    setShowSelector(false);
    setActiveForm(formType);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection onJoinNetwork={openFormSelector} />
      <ServicesSection />
      <GlobalPresenceSection />
      <ClienteleSection />
      <LuxuryExperienceSection />
      <div id="mobile-app">
        <QRCodeSection />
      </div>
      <ContactSection 
        onJoinNetwork={openFormSelector}
        onFormSelect={handleFormSelect}
        onCloseAllForms={closeAllForms}
      />
      <Footer />
      
      <FormSelector 
        isOpen={showSelector}
        onClose={closeAllForms}
        onSelectForm={handleFormSelect}
      />
      
      <ClientIntakeForm
        isOpen={activeForm === 'client'}
        onClose={closeAllForms}
      />
      
      <SubcontractorForm
        isOpen={activeForm === 'subcontractor'}
        onClose={closeAllForms}
      />
      
      <RegionalPartnerForm
        isOpen={activeForm === 'partner'}
        onClose={closeAllForms}
      />
    </div>
  );
}
