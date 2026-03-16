import React from 'react';
import { motion } from 'motion/react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { PublicService, type PublicMarketplaceProduct } from '@/src/services/public';
import {
  Search,
  Filter,
  ArrowRight,
  Package,
  Server,
  Activity,
  ShoppingCart,
  Dumbbell,
  Smartphone,
  Zap,
  ShieldCheck,
  Clock,
  TrendingUp,
} from 'lucide-react';

type MarketplaceCategoryProps = {
  categoryOverride?: string;
};

type PriceRange = 'Under $500' | '$500 - $5,000' | '$5,000+';

const categoryConfig: Record<
  string,
  {
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bgGlow: string;
    searchPlaceholder: string;
    filterLabels: string[];
  }
> = {
  all: {
    title: 'Marketplace',
    description: 'Browse vetted clinical products, diagnostics, digital tools, and recovery infrastructure.',
    icon: Package,
    color: 'text-primary',
    bgGlow: 'bg-primary/10',
    searchPlaceholder: 'Search the marketplace...',
    filterLabels: ['Clinical', 'Direct Pay', 'Telehealth', 'Remote Monitoring'],
  },
  equipment: {
    title: 'Clinical Equipment',
    description: 'Procure capital equipment and treatment devices with verified ROI.',
    icon: Server,
    color: 'text-primary',
    bgGlow: 'bg-primary/10',
    searchPlaceholder: 'Search equipment, modalities, or vendors...',
    filterLabels: ['FDA', 'Lease', 'Hardware', 'Treatment'],
  },
  diagnostics: {
    title: 'Diagnostics & Labs',
    description: 'Advanced testing kits and lab partnerships for comprehensive patient insights.',
    icon: Activity,
    color: 'text-secondary',
    bgGlow: 'bg-secondary/10',
    searchPlaceholder: 'Search labs, panels, or biomarkers...',
    filterLabels: ['HL7', 'Blood', 'DNA', 'Turnaround'],
  },
  supplements: {
    title: 'Supplements & Protocols',
    description: 'Clinical-grade supplements, peptides, and specialized formulations.',
    icon: ShoppingCart,
    color: 'text-secondary',
    bgGlow: 'bg-secondary/10',
    searchPlaceholder: 'Search supplements, peptides, or protocols...',
    filterLabels: ['Peptides', 'Protocol', 'Recurring Revenue', 'Direct to Patient'],
  },
  'health-tech': {
    title: 'Health Tech & Biometrics',
    description: 'Wearables, cognitive tools, and telemetry hardware for patient tracking and optimization.',
    icon: Smartphone,
    color: 'text-primary',
    bgGlow: 'bg-primary/10',
    searchPlaceholder: 'Search biometrics, neuro-tech, or optimization hardware...',
    filterLabels: ['Biometrics', 'Wearable', 'Recovery', 'Data Export'],
  },
  'digital-health': {
    title: 'Digital Health & Software',
    description: 'Vetted clinical software, remote monitoring tools, and digital infrastructure.',
    icon: Smartphone,
    color: 'text-primary',
    bgGlow: 'bg-primary/10',
    searchPlaceholder: 'Search software, integrations, or capabilities...',
    filterLabels: ['Remote Monitoring', 'Workflow', 'Analytics', 'EMR'],
  },
  'home-gym': {
    title: 'Home Gym & Recovery',
    description: 'Premium fitness and recovery hardware for patients and at-home protocols.',
    icon: Dumbbell,
    color: 'text-warning',
    bgGlow: 'bg-warning/10',
    searchPlaceholder: 'Search recovery tools, wearables, or brands...',
    filterLabels: ['Sleep', 'Recovery', 'Wearable', 'Cold Therapy'],
  },
  clinics: {
    title: 'Clinic Supplies',
    description: 'Operational supplies, protocol kits, and practice infrastructure.',
    icon: Package,
    color: 'text-primary',
    bgGlow: 'bg-primary/10',
    searchPlaceholder: 'Search clinic supplies and operational tools...',
    filterLabels: ['Operational', 'Protocol', 'Consumable', 'Practice'],
  },
};

function matchesPriceRange(product: PublicMarketplaceProduct, selectedRanges: PriceRange[]) {
  if (selectedRanges.length === 0) {
    return true;
  }

  const match = product.price.replace(/,/g, '').match(/\$([0-9]+(?:\.[0-9]+)?)/);
  if (!match) {
    return selectedRanges.includes('$5,000+');
  }

  const amount = Number.parseFloat(match[1]);
  return selectedRanges.some((range) => {
    if (range === 'Under $500') {
      return amount < 500;
    }
    if (range === '$500 - $5,000') {
      return amount >= 500 && amount < 5000;
    }
    return amount >= 5000;
  });
}

function matchesSignal(product: PublicMarketplaceProduct, selectedSignals: string[]) {
  if (selectedSignals.length === 0) {
    return true;
  }

  const haystack = [
    product.category,
    product.description,
    product.vendor,
    product.compatibility,
    product.compliance,
    product.sample,
    product.turnaround,
    ...product.features,
    ...product.useCases,
  ]
    .join(' ')
    .toLowerCase();

  return selectedSignals.some((signal) => haystack.includes(signal.toLowerCase()));
}

function ProductImage({ product }: { product: PublicMarketplaceProduct }) {
  if (!product.image) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-2 to-surface-3">
        <Package className="h-10 w-10 text-text-secondary" />
      </div>
    );
  }

  return (
    <img
      src={product.image}
      alt={product.name}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      referrerPolicy="no-referrer"
    />
  );
}

export function MarketplaceCategory({ categoryOverride }: MarketplaceCategoryProps) {
  const params = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const resolvedCategory = categoryOverride || params.category || 'all';
  const config = categoryConfig[resolvedCategory] || categoryConfig.all;
  const Icon = config.icon;
  const initialQuery = searchParams.get('query') || '';

  const [searchQuery, setSearchQuery] = React.useState(initialQuery);
  const [selectedPriceRanges, setSelectedPriceRanges] = React.useState<PriceRange[]>([]);
  const [selectedSignals, setSelectedSignals] = React.useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = React.useState(true);
  const [products, setProducts] = React.useState<PublicMarketplaceProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  React.useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await PublicService.getMarketplaceProducts({
          category: resolvedCategory === 'all' ? undefined : resolvedCategory,
        });

        if (isActive) {
          setProducts(response.products);
        }
      } catch (loadError) {
        console.error('Failed to load marketplace products:', loadError);
        if (isActive) {
          setProducts([]);
          setError('Unable to load the live marketplace catalog right now.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, [resolvedCategory]);

  const togglePriceRange = (range: PriceRange) => {
    setSelectedPriceRanges((current) =>
      current.includes(range) ? current.filter((entry) => entry !== range) : [...current, range],
    );
  };

  const toggleSignal = (signal: string) => {
    setSelectedSignals((current) =>
      current.includes(signal) ? current.filter((entry) => entry !== signal) : [...current, signal],
    );
  };

  const filteredProducts = React.useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          product.name,
          product.description,
          product.vendor,
          product.category,
          product.compatibility,
          ...product.features,
          ...product.useCases,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesVerified = !verifiedOnly || product.verified;
      return (
        matchesQuery &&
        matchesVerified &&
        matchesPriceRange(product, selectedPriceRanges) &&
        matchesSignal(product, selectedSignals)
      );
    });
  }, [products, searchQuery, selectedPriceRanges, selectedSignals, verifiedOnly]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <section className="relative pt-32 pb-16 border-b border-surface-3/50 overflow-hidden">
        <div className="absolute inset-0 bg-[#05070A]" />
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] ${config.bgGlow} rounded-full blur-[100px] opacity-40 mix-blend-screen`}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div
                className={`w-16 h-16 shrink-0 rounded-2xl bg-surface-2/80 backdrop-blur-xl border border-surface-3 flex items-center justify-center ${config.color} shadow-2xl`}
              >
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/50 border border-surface-3 mb-3">
                  <ShieldCheck className="w-3 h-3 text-success" />
                  <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
                    Live Marketplace Catalog
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                  {config.title}
                </h1>
                <p className="text-lg text-text-secondary max-w-2xl font-light">{config.description}</p>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <Link to="/contact?role=clinic&topic=procurement_support" className="w-full md:w-auto">
                <Button variant="outline" className="w-full md:w-auto border-surface-3 hover:bg-surface-2 text-white">
                  <Clock className="w-4 h-4 mr-2" /> Procurement Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 flex-grow bg-[#0B0F14] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 relative z-10">
          <div className="w-full lg:w-72 space-y-6 flex-shrink-0">
            <Card className="p-6 bg-surface-1/80 backdrop-blur-xl border-surface-3 shadow-xl">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-3/50">
                <Filter className="w-5 h-5 text-text-secondary" />
                <h3 className="font-bold text-white text-lg">Filters</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Price Range</h4>
                  <div className="space-y-3">
                    {(['Under $500', '$500 - $5,000', '$5,000+'] as PriceRange[]).map((range) => (
                      <label
                        key={range}
                        className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPriceRanges.includes(range)}
                          onChange={() => togglePriceRange(range)}
                          className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4"
                        />
                        {range}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Signals</h4>
                  <div className="space-y-3">
                    {config.filterLabels.map((label) => (
                      <label
                        key={label}
                        className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSignals.includes(label)}
                          onChange={() => toggleSignal(label)}
                          className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Catalog State</h4>
                  <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={() => setVerifiedOnly((current) => !current)}
                      className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4"
                    />
                    Verified products only
                  </label>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-surface-1 to-surface-2 border-surface-3 shadow-xl relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 ${config.bgGlow} rounded-full blur-[24px]`} />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-mono uppercase tracking-wider mb-4">
                  <Zap className="w-3 h-3" /> Procurement Advisor
                </div>
                <h4 className="text-white font-bold mb-2">Need a custom recommendation?</h4>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  We can match your clinic, protocol mix, or patient demand to the right vendor stack.
                </p>
                <Link to="/clinics/icp">
                  <Button className="w-full bg-surface-3 hover:bg-surface-3/80 text-white text-sm">
                    Run Clinic Analysis
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          <div className="flex-grow space-y-6">
            <div className="relative w-full group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex items-center bg-surface-1/80 backdrop-blur-xl border border-surface-3 rounded-xl p-1">
                <Search className="w-5 h-5 text-text-secondary ml-4" />
                <input
                  type="text"
                  placeholder={config.searchPlaceholder}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full h-12 bg-transparent border-none text-white placeholder-text-secondary focus:outline-none focus:ring-0 px-4"
                />
              </div>
            </div>

            {error ? (
              <Card className="p-6 bg-danger/10 border-danger/20 text-danger">
                {error}
              </Card>
            ) : null}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden border-surface-3 bg-surface-1/80">
                    <div className="h-48 bg-surface-2 animate-pulse" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 w-24 rounded bg-surface-2 animate-pulse" />
                      <div className="h-6 w-3/4 rounded bg-surface-2 animate-pulse" />
                      <div className="h-16 rounded bg-surface-2 animate-pulse" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link key={product.id} to={`/marketplace/product/${product.id}`}>
                    <Card className="p-0 bg-surface-1/80 backdrop-blur-sm border-surface-3 flex flex-col h-full overflow-hidden hover:border-primary/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-300 group">
                      <div className="h-48 bg-surface-2 relative overflow-hidden">
                        <ProductImage product={product} />
                        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md border border-surface-3 px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium text-white">
                          <ShieldCheck className="w-3 h-3 text-primary" /> {product.compliance}
                        </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-mono text-text-secondary uppercase tracking-wider">{product.vendor}</div>
                          <span className="text-xs font-medium bg-surface-2 text-text-secondary px-2 py-1 rounded-md border border-surface-3">
                            {product.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-2 leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-sm text-text-secondary mb-6 flex-grow leading-relaxed">
                          {product.description || 'Live catalog item'}
                        </p>

                        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-surface-3/50">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-medium text-white text-lg">{product.price}</span>
                            <span className="flex items-center gap-1 text-sm font-medium text-success bg-success/10 px-2 py-1 rounded-md">
                              ★ {product.rating.toFixed(1)}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="flex flex-col bg-surface-2/50 p-2 rounded-lg border border-surface-3">
                              <span className="text-[10px] text-text-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Delivery
                              </span>
                              <span className="text-sm font-bold text-white truncate" title={product.implementation || product.turnaround || product.payback}>
                                {product.implementation || product.turnaround || product.payback || 'Custom'}
                              </span>
                            </div>
                            <div className="flex flex-col bg-surface-2/50 p-2 rounded-lg border border-surface-3">
                              <span className="text-[10px] text-text-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> ROI
                              </span>
                              <span className="text-sm font-bold text-white truncate" title={product.roi || product.revenuePerPatient}>
                                {product.roi || product.revenuePerPatient || 'Custom'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16 px-8 text-center border border-surface-3 rounded-2xl bg-surface-1/50 backdrop-blur-xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[64px]" />
                <div className="relative z-10 max-w-lg mx-auto">
                  <div className="w-20 h-20 rounded-2xl bg-surface-2 border border-surface-3 flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Icon className={`w-10 h-10 ${config.color}`} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4">
                    No published products match these filters
                  </h3>
                  <p className="text-text-secondary mb-8 leading-relaxed">
                    There are no live catalog items in this view yet. Adjust your filters or contact procurement for a direct vendor recommendation.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/contact?role=clinic&topic=custom_procurement_request">
                      <Button className="bg-primary hover:bg-primary-hover text-background font-semibold">
                        Request Custom Procurement
                      </Button>
                    </Link>
                    <Link to="/marketplace">
                      <Button variant="outline" className="border-surface-3 hover:bg-surface-2 text-white">
                        Back to Marketplace <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
