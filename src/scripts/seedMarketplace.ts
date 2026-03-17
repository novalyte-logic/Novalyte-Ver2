import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  {
    id: 'inbody-770',
    vendorId: 'inbody-usa',
    vendorName: 'InBody USA',
    name: 'InBody 770',
    slug: 'inbody-770',
    category: 'equipment',
    subCategory: 'Body Composition',
    price: 18500,
    priceDisplay: '$18,500',
    description: 'Advanced body composition analyzer providing detailed clinical insights into muscle mass, body fat, and water retention.',
    detailedDescription: 'The InBody 770 goes beyond traditional body composition analysis. It offers a comprehensive look at extracellular water and phase angle, making it an essential tool for optimization clinics tracking patient protocol adherence and overall cellular health.',
    imageUrl: 'https://picsum.photos/seed/inbody770/800/600',
    gallery: [
      'https://picsum.photos/seed/inbody770/800/600',
      'https://picsum.photos/seed/inbody1/800/600',
      'https://picsum.photos/seed/inbody2/800/600'
    ],
    features: [
      'Segmental Lean Analysis',
      'Extracellular Water Ratio',
      'Visceral Fat Area',
      'Phase Angle Measurement',
      'Cloud-based Data Management',
      'HL7/EMR Integration Ready'
    ],
    benefits: [
      'Increases patient retention through objective progress tracking',
      'Enables premium pricing for optimization protocols',
      'Reduces consultation time with automated reporting',
      'Provides clinical-grade accuracy for hormone therapy monitoring'
    ],
    specs: [
      { label: 'Dimensions', value: '20.7 x 33.6 x 46.3 in' },
      { label: 'Weight', value: '83.8 lbs' },
      { label: 'Testing Time', value: '60 Seconds' },
      { label: 'Frequencies', value: '1, 5, 50, 250, 500, 1000 kHz' },
      { label: 'Database', value: '100,000 results' }
    ],
    requirements: [
      'Clinic Approval Required',
      'Dedicated Floor Space (3x3 ft)',
      'Standard 110V Outlet',
      'Active Wi-Fi Connection'
    ],
    useCases: [
      'Baseline Health Assessments',
      'Weight Loss Program Tracking',
      'Hormone Optimization Monitoring',
      'Athletic Performance Evaluation'
    ],
    compliance: 'FDA Class II Medical Device',
    conversionType: 'inquiry',
    targetSpecialties: ['Weight Loss', 'Hormone Therapy', 'Functional Medicine'],
    isPopular: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 128,
    inventory: 50,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'oura-ring-gen3',
    vendorId: 'oura-health',
    vendorName: 'Oura Health',
    name: 'Oura Ring Gen3',
    slug: 'oura-ring-gen3',
    category: 'health-tech',
    subCategory: 'Wearables',
    price: 299,
    priceDisplay: '$299',
    description: 'Continuous health monitoring ring tracking sleep, readiness, and activity scores.',
    detailedDescription: 'The Oura Ring Gen3 provides highly accurate sleep and activity tracking. For clinics, it offers a continuous stream of patient data to monitor the effectiveness of lifestyle interventions and recovery protocols.',
    imageUrl: 'https://picsum.photos/seed/ouraring/800/600',
    gallery: [
      'https://picsum.photos/seed/ouraring/800/600',
      'https://picsum.photos/seed/ouraring1/800/600'
    ],
    features: [
      'Advanced Sleep Staging',
      'Continuous Heart Rate Monitoring',
      'Temperature Trend Tracking',
      'Blood Oxygen (SpO2) Sensing',
      'API Access for Clinics'
    ],
    benefits: [
      'Remote patient monitoring capabilities',
      'Objective data on protocol adherence',
      'Early detection of illness or overtraining'
    ],
    specs: [
      { label: 'Material', value: 'Titanium' },
      { label: 'Battery Life', value: 'Up to 7 days' },
      { label: 'Water Resistance', value: 'Up to 100m' }
    ],
    requirements: [
      'Smartphone for app syncing',
      'Bluetooth connection'
    ],
    useCases: [
      'Sleep Optimization',
      'Recovery Tracking',
      'Remote Patient Monitoring'
    ],
    compliance: 'Consumer Health Device',
    conversionType: 'direct',
    targetSpecialties: ['Longevity', 'Sports Medicine', 'Primary Care'],
    isPopular: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 5430,
    inventory: 1000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'dutch-complete',
    vendorId: 'precision-analytical',
    vendorName: 'Precision Analytical',
    name: 'DUTCH Complete',
    slug: 'dutch-complete',
    category: 'diagnostics',
    subCategory: 'Hormone Testing',
    price: 399,
    priceDisplay: '$399',
    description: 'Comprehensive dried urine test for comprehensive hormones.',
    detailedDescription: 'The DUTCH Complete is the most advanced hormone test, offering an extensive profile of sex and adrenal hormones and melatonin, along with their metabolites, to identify symptoms of hormonal imbalances.',
    imageUrl: 'https://picsum.photos/seed/dutchtest/800/600',
    gallery: [
      'https://picsum.photos/seed/dutchtest/800/600'
    ],
    features: [
      'Extensive Hormone Profile',
      'Metabolite Tracking',
      'Cortisol Awakening Response (CAR)',
      'Easy At-Home Collection'
    ],
    benefits: [
      'Precise hormone replacement therapy (HRT) dosing',
      'Identification of adrenal fatigue',
      'Comprehensive view of hormone metabolism'
    ],
    specs: [
      { label: 'Sample Type', value: 'Dried Urine' },
      { label: 'Turnaround Time', value: '7-10 Business Days' }
    ],
    requirements: [
      'Physician Authorization Required',
      'Patient Assessment'
    ],
    useCases: [
      'HRT Optimization',
      'Adrenal Dysfunction Diagnosis',
      'PCOS Evaluation'
    ],
    compliance: 'CLIA Certified Lab',
    conversionType: 'assessment',
    targetSpecialties: ['Endocrinology', 'Functional Medicine', "Women's Health"],
    isPopular: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 320,
    inventory: 500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'nad-plus-iv',
    vendorId: 'vitality-labs',
    vendorName: 'Vitality Labs',
    name: 'NAD+ IV Protocol Kit',
    slug: 'nad-plus-iv',
    category: 'supplements',
    subCategory: 'IV Therapy',
    price: 250,
    priceDisplay: '$250 / kit',
    description: 'Clinical-grade NAD+ IV therapy kits for cellular regeneration and anti-aging.',
    detailedDescription: 'Complete protocol kits for administering NAD+ IV therapy. Includes high-purity NAD+, necessary diluents, and administration guidelines for optimal patient outcomes and safety.',
    imageUrl: 'https://picsum.photos/seed/nadiv/800/600',
    gallery: [
      'https://picsum.photos/seed/nadiv/800/600'
    ],
    features: [
      'High-Purity NAD+',
      'Complete Administration Kit',
      'Protocol Guidelines Included'
    ],
    benefits: [
      'High-margin clinic service',
      'Immediate patient energy boost',
      'Cellular repair and anti-aging benefits'
    ],
    specs: [
      { label: 'Dosage', value: '500mg NAD+' },
      { label: 'Storage', value: 'Refrigerated' }
    ],
    requirements: [
      'Clinic Approval Required',
      'Licensed Medical Professional for Administration'
    ],
    useCases: [
      'Anti-Aging Protocols',
      'Addiction Recovery Support',
      'Chronic Fatigue Treatment'
    ],
    compliance: 'FDA Registered Pharmacy',
    conversionType: 'approval',
    targetSpecialties: ['IV Therapy', 'Longevity', 'Integrative Medicine'],
    isPopular: true,
    isNew: false,
    rating: 4.7,
    reviewCount: 85,
    inventory: 200,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seed() {
  try {
    const batch = writeBatch(db);
    for (const product of products) {
      const docRef = doc(collection(db, 'products'), product.id);
      batch.set(docRef, product);
    }
    await batch.commit();
    console.log('Successfully seeded products!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}

seed();