import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, BookOpen, MessageCircle, FileText, ExternalLink } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function ClinicHelp() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Help & Support</h1>
          <p className="text-text-secondary mt-1">Get assistance, read documentation, and contact our team.</p>
        </div>
        <div className="flex gap-3">
          <Button className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Contact Support</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-surface-1 border-surface-3 hover:border-primary/50 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">Knowledge Base</h3>
          <p className="text-text-secondary text-sm mb-4">Browse articles, tutorials, and guides on how to use Novalyte OS.</p>
          <div className="flex items-center gap-2 text-primary text-sm font-medium">
            Browse Articles <ExternalLink className="w-4 h-4" />
          </div>
        </Card>

        <Card className="p-6 bg-surface-1 border-surface-3 hover:border-secondary/50 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">API Documentation</h3>
          <p className="text-text-secondary text-sm mb-4">Integrate your EMR and other tools with our developer API.</p>
          <div className="flex items-center gap-2 text-secondary text-sm font-medium">
            View Docs <ExternalLink className="w-4 h-4" />
          </div>
        </Card>

        <Card className="p-6 bg-surface-1 border-surface-3 hover:border-warning/50 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center text-warning mb-4">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">Community Forum</h3>
          <p className="text-text-secondary text-sm mb-4">Connect with other clinic operators, share protocols, and ask questions.</p>
          <div className="flex items-center gap-2 text-warning text-sm font-medium">
            Join Discussion <ExternalLink className="w-4 h-4" />
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-surface-1 border-surface-3">
        <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "How do I integrate my EMR?", a: "Novalyte OS supports HL7 and FHIR standards. You can find integration guides in the API Documentation section." },
            { q: "How are leads scored?", a: "Leads are scored based on clinical fit, financial readiness, urgency, and engagement with our triage system." },
            { q: "Can I pause lead generation?", a: "Yes, you can adjust your lead velocity dial in the Leads tab to pause or accelerate incoming patient requests." },
            { q: "How do I request staffing?", a: "Navigate to the Workforce tab and click 'New Staffing Request'. Our AI will match you with qualified practitioners." },
          ].map((faq, i) => (
            <div key={i} className="p-4 border border-surface-3 rounded-lg bg-surface-2">
              <h3 className="font-medium text-text-primary mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary" /> {faq.q}
              </h3>
              <p className="text-sm text-text-secondary pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
