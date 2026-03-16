import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { PublicService, type PublicMarketplaceProduct } from '@/src/services/public';
import {
  ArrowLeft,
  Shield,
  Activity,
  Download,
  Star,
  TrendingUp,
  ArrowRight,
  ShoppingCart,
  ShieldCheck,
  Zap,
  Layers,
  Package,
} from 'lucide-react';

function ProductHeroImage({
  product,
  image,
}: {
  product: PublicMarketplaceProduct;
  image: string;
}) {
  if (!image) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-2 to-surface-3">
        <Package className="h-12 w-12 text-text-secondary" />
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={product.name}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      referrerPolicy="no-referrer"
    />
  );
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<'overview' | 'specs' | 'requirements'>('overview');
  const [activeImage, setActiveImage] = React.useState(0);
  const [product, setProduct] = React.useState<PublicMarketplaceProduct | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  React.useEffect(() => {
    let isActive = true;

    const loadProduct = async () => {
      if (!id) {
        setLoading(false);
        setNotFound(true);
        return;
      }

      setLoading(true);
      setError('');
      setNotFound(false);
      setActiveImage(0);

      try {
        const response = await PublicService.getMarketplaceProduct(id);
        if (isActive) {
          setProduct(response.product);
        }
      } catch (loadError) {
        console.error('Failed to load marketplace product:', loadError);
        if (isActive) {
          if (loadError instanceof Error && /not found/i.test(loadError.message)) {
            setNotFound(true);
          } else {
            setError('Unable to load this marketplace item right now.');
          }
          setProduct(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadProduct();

    return () => {
      isActive = false;
    };
  }, [id]);

  const gallery = React.useMemo(() => {
    if (!product) {
      return [] as string[];
    }
    return product.gallery.length > 0 ? product.gallery : product.image ? [product.image] : [];
  }, [product]);

  const getRoutingLogic = (item: PublicMarketplaceProduct) => {
    const requirements = item.requirements.join(' ').toLowerCase();
    const category = item.category.toLowerCase();

    if (
      requirements.includes('clinic') ||
      requirements.includes('physician') ||
      category.includes('equipment') ||
      category.includes('software')
    ) {
      return {
        label: 'Apply for Clinic Access',
        path: '/clinics/apply',
        icon: Shield,
        color: 'bg-primary hover:bg-primary-hover text-background',
        description: 'Requires verified clinic credentials or clinical procurement review.',
      };
    }

    if (
      category.includes('supplement') ||
      category.includes('diagnostic') ||
      requirements.includes('assessment')
    ) {
      return {
        label: 'Start Patient Assessment',
        path: '/patient/assessment',
        icon: Activity,
        color: 'bg-secondary hover:bg-secondary-hover text-white',
        description: 'Clinical routing is required before protocol fulfillment.',
      };
    }

    if (
      requirements.includes('no prescription') ||
      category.includes('recovery') ||
      category.includes('home gym') ||
      category.includes('biometrics')
    ) {
      return {
        label: 'Request Purchase Support',
        path: `/contact?role=patient&topic=consumer_purchase&product=${encodeURIComponent(item.name)}`,
        icon: ShoppingCart,
        color: 'bg-[#F97316] hover:bg-[#EA580C] text-white',
        description: 'Direct purchase assistance is available for consumer-accessible items.',
      };
    }

    return {
      label: 'Request Quote',
      path: `/contact?role=clinic&topic=product_quote&product=${encodeURIComponent(item.name)}`,
      icon: ArrowRight,
      color: 'bg-surface-3 hover:bg-surface-3/80 text-white',
      description: 'Contact procurement for pricing, rollout, and implementation details.',
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070A] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="mt-4 text-sm text-text-secondary">Loading marketplace item...</p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-[#05070A] flex items-center justify-center px-4">
        <Card className="w-full max-w-xl bg-surface-1 border-surface-3 p-8 text-center">
          <h1 className="text-3xl font-display font-bold text-white">Product not found</h1>
          <p className="mt-3 text-text-secondary">
            This marketplace item is not published in the current catalog.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/marketplace">
              <Button>Return to Marketplace</Button>
            </Link>
            <Link to="/contact?role=clinic&topic=product_catalog_request">
              <Button variant="outline" className="border-surface-3 hover:bg-surface-2 text-white">
                Contact Procurement
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const route = getRoutingLogic(product);
  const RouteIcon = route.icon;

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col pb-24">
      <section className="pt-24 pb-6 border-b border-surface-3/50 bg-surface-1/50 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {error ? (
          <Card className="mb-6 border-danger/20 bg-danger/10 p-4 text-danger">{error}</Card>
        ) : null}

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3 space-y-12">
            <div className="space-y-6">
              <div className="aspect-video md:aspect-[21/9] rounded-2xl bg-surface-2 border border-surface-3 overflow-hidden relative group">
                <ProductHeroImage product={product} image={gallery[activeImage] || product.image} />
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-background/80 backdrop-blur-md text-white border border-surface-3 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-2/80 backdrop-blur-md text-text-secondary border border-surface-3 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-success" /> {product.compliance}
                  </span>
                </div>
              </div>

              {gallery.length > 1 ? (
                <div className="grid grid-cols-3 gap-3">
                  {gallery.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`aspect-video rounded-xl overflow-hidden border ${
                        activeImage === index ? 'border-primary' : 'border-surface-3'
                      }`}
                    >
                      <ProductHeroImage product={product} image={image} />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
                  {product.vendor}
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-success">
                  <Star className="w-4 h-4 fill-current" /> {product.rating.toFixed(1)}
                </span>
                {product.reviews ? (
                  <span className="text-sm text-text-secondary">{product.reviews} reviews</span>
                ) : null}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">{product.name}</h1>
              <p className="mt-4 text-lg text-text-secondary leading-relaxed">
                {product.description || 'Published marketplace item'}
              </p>
            </div>

            <div className="flex gap-2 border-b border-surface-3 pb-2 overflow-x-auto">
              {(['overview', 'specs', 'requirements'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${
                    activeTab === tab ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'overview' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-surface-1/80 border-surface-3">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" /> Core Features
                  </h2>
                  <ul className="space-y-3 text-sm text-text-secondary">
                    {(product.features.length > 0 ? product.features : ['Feature details available during procurement review.']).map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 bg-surface-1/80 border-surface-3">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-success" /> Outcome Fit
                  </h2>
                  <ul className="space-y-3 text-sm text-text-secondary">
                    {(product.useCases.length > 0 ? product.useCases : product.benefits).length > 0 ? (
                      (product.useCases.length > 0 ? product.useCases : product.benefits).map((entry) => (
                        <li key={entry} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-success" />
                          <span>{entry}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-text-secondary">Use case details are available during rollout review.</li>
                    )}
                  </ul>
                </Card>
              </div>
            ) : null}

            {activeTab === 'specs' ? (
              <Card className="p-6 bg-surface-1/80 border-surface-3">
                <h2 className="text-lg font-bold text-white mb-4">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(product.specs.length > 0
                    ? product.specs
                    : [
                        { label: 'Category', value: product.category },
                        { label: 'Vendor', value: product.vendor },
                        { label: 'Compliance', value: product.compliance },
                      ]).map((spec) => (
                    <div key={spec.label} className="rounded-xl border border-surface-3 bg-surface-2/50 p-4">
                      <p className="text-xs uppercase tracking-wider text-text-secondary">{spec.label}</p>
                      <p className="mt-2 text-white font-medium">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {activeTab === 'requirements' ? (
              <Card className="p-6 bg-surface-1/80 border-surface-3">
                <h2 className="text-lg font-bold text-white mb-4">Procurement Requirements</h2>
                <ul className="space-y-3 text-sm text-text-secondary">
                  {(product.requirements.length > 0
                    ? product.requirements
                    : ['Procurement review determines any credentialing or implementation requirements.']).map(
                    (requirement) => (
                      <li key={requirement} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-warning" />
                        <span>{requirement}</span>
                      </li>
                    ),
                  )}
                </ul>
              </Card>
            ) : null}
          </div>

          <div className="w-full lg:w-1/3 space-y-6">
            <Card className="p-6 bg-surface-1/80 border-surface-3 sticky top-28">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm uppercase tracking-wider text-text-secondary">Published Price</p>
                  <p className="text-3xl font-display font-bold text-white">{product.price}</p>
                </div>
                <div className="rounded-xl bg-success/10 px-3 py-2 text-success text-sm font-medium">
                  {product.roi || product.revenuePerPatient || 'Custom ROI'}
                </div>
              </div>

              <p className="text-sm text-text-secondary mb-6">{route.description}</p>

              <Link to={route.path}>
                <Button className={`w-full h-12 border-none ${route.color}`}>
                  <RouteIcon className="w-4 h-4 mr-2" /> {route.label}
                </Button>
              </Link>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link to={`/contact?role=clinic&topic=product_quote&product=${encodeURIComponent(product.name)}`}>
                  <Button variant="outline" className="w-full border-surface-3 hover:bg-surface-2 text-white">
                    <Download className="w-4 h-4 mr-2" /> Quote
                  </Button>
                </Link>
                <Link to="/contact?role=vendor&topic=marketplace_vendor_support">
                  <Button variant="outline" className="w-full border-surface-3 hover:bg-surface-2 text-white">
                    <Zap className="w-4 h-4 mr-2" /> Support
                  </Button>
                </Link>
              </div>

              <div className="mt-6 space-y-3 text-sm text-text-secondary">
                {product.implementation ? (
                  <div className="flex justify-between gap-3">
                    <span>Implementation</span>
                    <span className="text-white">{product.implementation}</span>
                  </div>
                ) : null}
                {product.compatibility ? (
                  <div className="flex justify-between gap-3">
                    <span>Compatibility</span>
                    <span className="text-white text-right">{product.compatibility}</span>
                  </div>
                ) : null}
                {product.turnaround ? (
                  <div className="flex justify-between gap-3">
                    <span>Turnaround</span>
                    <span className="text-white">{product.turnaround}</span>
                  </div>
                ) : null}
                {product.sample ? (
                  <div className="flex justify-between gap-3">
                    <span>Sample Type</span>
                    <span className="text-white">{product.sample}</span>
                  </div>
                ) : null}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
