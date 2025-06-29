
import React from 'react';
import { User } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section>
      <h2 className="text-lg font-semibold flex items-center mb-2">
        <User className="h-5 w-5 mr-2 text-primary" />
        About
      </h2>
      <p className="text-sm text-muted-foreground">
        LockBox v1.0.0
      </p>
      <p className="text-sm text-muted-foreground">
        A secure password manager
      </p>
    </section>
  );
};
