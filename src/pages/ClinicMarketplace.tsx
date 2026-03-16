import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  CheckCircle2,
  Filter,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { ClinicApiError, ClinicService } from '@/src/services/clinic';
import { PublicApiError, PublicService, type PublicMarketplaceProduct } from '@/src/services/public';

const CATEGORIES = [
  { id: 'all', label: 'All Infrastructure' },
  { id: 'equipment', label: 'Capital Equipment' },
  { id: 'diagnostics', label: 'Diagnostics & Labs' },
  { id: 'digital-health', label: 'Digital Health' },
  { id: 'health-tech', label: 'Health Tech' },
  { id: 'home-gym', label: 'Home Gym & Recovery' },
];

export function ClinicMarketplace() {
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [products, setProducts] = React.useState<PublicMarketplaceProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [orderingProductId, setOrderingProductId] = React.useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = React.useState(true);
  const [error, setError] = React.useState('');
  const [orderFeedback, setOrderFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await PublicService.getMarketplaceProducts({
          category: activeCategory === 'all' ? undefined : activeCategory,
        });
        if (isActive) {
          setProducts(response.products);
        }
      } catch (loadError) {
        console.error('Failed to load clinic marketplace:', loadError);
        if (isActive) {
          setProducts([]);
          setError(
            loadError instanceof PublicApiError
              ? loadError.message
              : 'Unable to load the live procurement catalog right now.',
          );
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
  }, [activeCategory]);

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
      const matchesVerification = !verifiedOnly || product.verified;
      return matchesQuery && matchesVerification;
    });
  }, [products, searchQuery, verifiedOnly]);

  const handleOrderService = async (product: PublicMarketplaceProduct) => {
    setOrderingProductId(product.id);
    setOrderFeedback(null);
    try {
      const response = await ClinicService.createMarketplaceOrder(product.id);
      setOrderFeedback({
        type: 'success',
        message: `Procurement request ${response.order.id.slice(0, 8).toUpperCase()} queued for ${product.name}.`,
      });
    } catch (error) {
      console.error('Error ordering service:', error);
      setOrderFeedback({
        type: 'error',
        message:
          error instanceof ClinicApiError
            ? error.message
            : 'Unable to submit that procurement request right now.',
      });
    } finally {
      setOrderingProductId(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Infrastructure & Procurement</h1>
          <p className="text-text-secondary mt-1">Live marketplace catalog with clinic-side procurement requests routed through the backend.</p>
          {orderFeedback ? (
            <div className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
              orderFeedback.type === 'success'
                ? 'border-success/20 bg-success/10 text-success'
                : 'border-danger/20 bg-danger/10 text-danger'
            }`}>
              {orderFeedback.message}
            </div>
          ) : null}
          {error ? (
            <div className="mt-4 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard/billing">
            <Button variant="outline" className="border-surface-3 text-white hover:bg-surface-2">
              Procurement History
            </Button>
          </Link>
          <Link to="/contact?role=clinic&topic=custom_procurement_request">
            <Button className="bg-primary hover:bg-primary/90 text-black font-bold">
              Request Custom Sourcing
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-8 bg-[#0B0F14] border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sparkles className="w-40 h-40 text-primary" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Live Procurement View</h2>
          </div>
          <p className="text-2xl font-display font-bold text-white leading-tight">
            {filteredProducts.length
              ? `${filteredProducts.length} verified catalog item${filteredProducts.length === 1 ? '' : 's'} are currently available in ${CATEGORIES.find((category) => category.id === activeCategory)?.label || 'the marketplace'}.`
              : 'No published products match the current filters. Adjust the catalog filters or request a custom sourcing workflow.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-text-secondary">
            <span className="inline-flex items-center gap-2 rounded-full border border-surface-3 px-3 py-1.5">
              <ShieldCheck className="w-4 h-4 text-success" />
              {products.filter((product) => product.verified).length} verified products
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-surface-3 px-3 py-1.5">
              <TrendingUp className="w-4 h-4 text-primary" />
              Real backend procurement requests
            </span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-8">
        <div className="space-y-6">
          <Card className="p-6 bg-surface-1 border-surface-3">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-text-secondary" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Catalog Filters</h2>
            </div>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-surface-2 text-text-secondary hover:text-white'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <label className="mt-6 flex items-center gap-3 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={() => setVerifiedOnly((current) => !current)}
                className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50"
              />
              Verified products only
            </label>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products, vendors, protocols, or compatibility..."
              className="w-full rounded-xl border border-surface-3 bg-surface-1 px-11 py-3 text-white outline-none focus:border-primary/40"
            />
          </div>

          {loading ? (
            <Card className="p-10 bg-surface-1 border-surface-3 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </Card>
          ) : filteredProducts.length ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden border-surface-3 bg-[#0B0F14] flex flex-col">
                  <div className="p-5 border-b border-surface-3 bg-surface-1/50">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-text-secondary">{product.vendor}</p>
                        <h3 className="mt-2 text-xl font-bold text-white">{product.name}</h3>
                      </div>
                      {product.verified ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-[10px] uppercase tracking-wider text-success">
                          <ShieldCheck className="w-3 h-3" />
                          Verified
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-4 text-sm text-text-secondary leading-7">
                      {product.description || 'Live marketplace item.'}
                    </p>
                  </div>

                  <div className="p-5 flex-grow flex flex-col">
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="rounded-lg border border-surface-3 bg-surface-1/50 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-text-secondary">Category</p>
                        <p className="mt-1 text-sm font-bold text-white">{product.category}</p>
                      </div>
                      <div className="rounded-lg border border-surface-3 bg-surface-1/50 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-text-secondary">Price</p>
                        <p className="mt-1 text-sm font-bold text-white">{product.price || 'Contact for pricing'}</p>
                      </div>
                      <div className="rounded-lg border border-surface-3 bg-surface-1/50 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-text-secondary">Implementation</p>
                        <p className="mt-1 text-sm font-bold text-white">{product.implementation || product.turnaround || 'Custom'}</p>
                      </div>
                      <div className="rounded-lg border border-surface-3 bg-surface-1/50 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-text-secondary">ROI</p>
                        <p className="mt-1 text-sm font-bold text-white">{product.roi || product.revenuePerPatient || 'Custom'}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-text-secondary">
                      {product.compatibility ? (
                        <p><span className="text-white font-medium">Compatibility:</span> {product.compatibility}</p>
                      ) : null}
                      {product.compliance ? (
                        <p><span className="text-white font-medium">Compliance:</span> {product.compliance}</p>
                      ) : null}
                    </div>

                    <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
                      <Link to={`/marketplace/product/${product.id}`} className="flex-1">
                        <Button variant="outline" className="w-full border-surface-3 text-white hover:bg-surface-2">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold"
                        onClick={() => void handleOrderService(product)}
                        disabled={orderingProductId === product.id}
                      >
                        {orderingProductId === product.id ? 'Submitting...' : 'Request Procurement'}
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 bg-surface-1 border-surface-3 text-center">
              <Package className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white">No products match these filters</h3>
              <p className="mt-3 text-text-secondary">
                Adjust the category filters or open a direct procurement request for a custom vendor recommendation.
              </p>
              <div className="mt-6 flex justify-center">
                <Link to="/contact?role=clinic&topic=custom_procurement_request">
                  <Button className="bg-primary hover:bg-primary/90 text-black font-bold">
                    Request Custom Procurement
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
