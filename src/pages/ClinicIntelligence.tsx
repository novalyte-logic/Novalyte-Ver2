import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarCheck,
  DollarSign,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { ClinicApiError, ClinicService, type ClinicIntelligenceResponse } from '@/src/services/clinic';

export function ClinicIntelligence() {
  const [data, setData] = React.useState<ClinicIntelligenceResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let isActive = true;

    const loadIntelligence = async (silent = false) => {
      if (!silent) {
        setLoading(true);
      }

      try {
        const response = await ClinicService.getIntelligence();
        if (isActive) {
          setData(response);
          setError('');
        }
      } catch (loadError) {
        console.error('Failed to load clinic intelligence:', loadError);
        if (isActive) {
          setError(
            loadError instanceof ClinicApiError
              ? loadError.message
              : 'Unable to load strategic intelligence right now.',
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadIntelligence();
    const interval = window.setInterval(() => {
      void loadIntelligence(true);
    }, 30000);

    return () => {
      isActive = false;
      window.clearInterval(interval);
    };
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Strategic Intelligence</h1>
          <p className="text-text-secondary mt-1">Live clinic performance, source conversion, treatment demand, and operator recommendations.</p>
          {error ? (
            <div className="mt-4 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : null}
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/leads">
            <Button variant="outline" className="border-surface-3 text-white hover:bg-surface-2">
              Review Leads
            </Button>
          </Link>
          <Link to="/dashboard/workforce?tab=demand">
            <Button className="bg-primary hover:bg-primary/90 text-black font-bold">
              Plan Capacity
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-8 bg-[#0B0F14] border-secondary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sparkles className="w-40 h-40 text-secondary" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-secondary" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Live Summary</h2>
          </div>
          <p className="text-2xl font-display font-bold text-white leading-tight">
            {data?.summary || 'Live intelligence will populate as clinic operations data accumulates.'}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'Active Patients',
            value: data?.metrics.activePatients || 0,
            detail: 'Treating stage records',
            icon: Users,
            tone: 'text-primary',
            bg: 'bg-primary/10',
          },
          {
            label: 'Qualified Leads',
            value: data?.metrics.qualifiedLeads || 0,
            detail: 'Qualified, scheduled, or treating',
            icon: Target,
            tone: 'text-secondary',
            bg: 'bg-secondary/10',
          },
          {
            label: 'Booked Consults',
            value: data?.metrics.bookedConsults || 0,
            detail: 'Non-cancelled booking load',
            icon: CalendarCheck,
            tone: 'text-success',
            bg: 'bg-success/10',
          },
          {
            label: 'Recognized Revenue',
            value: data?.metrics.recognizedRevenueLabel || '$0',
            detail: 'Paid invoice total',
            icon: DollarSign,
            tone: 'text-white',
            bg: 'bg-surface-3',
          },
        ].map((metric) => (
          <Card key={metric.label} className="p-5 bg-[#0B0F14] border-surface-3">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${metric.bg} flex items-center justify-center ${metric.tone}`}>
                <metric.icon className="w-5 h-5" />
              </div>
              <BarChart3 className="w-4 h-4 text-text-secondary opacity-50" />
            </div>
            <div>
              <h3 className="text-3xl font-display font-bold text-white mb-1">{metric.value}</h3>
              <p className="text-sm font-medium text-text-secondary mb-1">{metric.label}</p>
              <p className="text-xs text-text-secondary/70">{metric.detail}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-6 bg-[#0B0F14] border-surface-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Source Conversion</h2>
              <p className="text-sm text-text-secondary">Live conversion from routed lead source to qualified pipeline.</p>
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>

          {data?.sourceAnalysis.length ? (
            <div className="space-y-4">
              {data.sourceAnalysis.map((source) => (
                <div key={source.source} className="rounded-xl border border-surface-3 bg-surface-1/40 p-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-bold text-white">{source.source}</span>
                    <span className="text-text-secondary">{source.volume} leads</span>
                  </div>
                  <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, source.conversion)}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-text-secondary">
                    {source.conversion}% converted into qualified pipeline.
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-surface-3 bg-surface-1/20 p-8 text-center text-text-secondary">
              Source analytics will populate after more routed leads arrive.
            </div>
          )}
        </Card>

        <Card className="p-6 bg-[#0B0F14] border-surface-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Treatment Demand Mix</h2>
              <p className="text-sm text-text-secondary">Intent distribution across live routed treatments.</p>
            </div>
            <Activity className="w-5 h-5 text-secondary" />
          </div>

          {data?.treatmentMix.length ? (
            <div className="space-y-3">
              {data.treatmentMix.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl border border-surface-3 bg-surface-1/40 px-4 py-3">
                  <span className="font-medium text-white">{item.label}</span>
                  <span className="text-sm font-mono text-text-secondary">{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-surface-3 bg-surface-1/20 p-8 text-center text-text-secondary">
              Treatment demand will appear once routed leads include treatment preferences.
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6 bg-[#0B0F14] border-surface-3">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Operator Recommendations</h2>
            <p className="text-sm text-text-secondary">Persisted intelligence cards and system-generated guidance.</p>
          </div>
          <Link to="/dashboard/marketplace">
            <Button variant="outline" className="border-surface-3 text-white hover:bg-surface-2">
              Open Marketplace <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {data?.insights.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.insights.map((insight) => (
              <Card key={insight.id} className="p-5 bg-surface-1 border-surface-3">
                <p className="text-xs uppercase tracking-wider text-text-secondary">{insight.type}</p>
                <h3 className="mt-2 text-lg font-bold text-white">{insight.title}</h3>
                <p className="mt-3 text-sm text-text-secondary leading-7">{insight.description}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs text-text-secondary">{new Date(insight.createdAt).toLocaleString()}</span>
                  <span className="text-sm font-bold text-primary">{insight.action}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-surface-3 bg-surface-1/20 p-10 text-center text-text-secondary">
            No persisted intelligence cards yet. Clinic insights will populate as routing, bookings, and billing data accumulate.
          </div>
        )}
      </Card>
    </div>
  );
}
