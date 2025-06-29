
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { SecuritySection } from '@/components/settings/SecuritySection';
import { DataManagementSection } from '@/components/settings/DataManagementSection';
import { AboutSection } from '@/components/settings/AboutSection';

const Settings: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <SecuritySection />
        <Separator />
        <DataManagementSection />
        <Separator />
        <AboutSection />
      </div>
    </div>
  );
};

export default Settings;
