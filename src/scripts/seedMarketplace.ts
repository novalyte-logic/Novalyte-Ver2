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
    id: 'inbody-970',
    vendorId: 'inbody-usa',
    vendorName: 'InBody USA',
    name: 'InBody 970',
    slug: 'inbody-970',
    category: 'equipment',
    subCategory: 'Body Composition',
    price: 22500,
    priceDisplay: '$22,500',
    description: 'Advanced body composition analyzer providing detailed clinical insights into muscle mass, body fat, and water retention.',
    detailedDescription: 'The InBody 970 goes beyond traditional body composition analysis. It offers a comprehensive look at extracellular water and phase angle, making it an essential tool for men\'s health optimization clinics tracking patient protocol adherence, muscle hypertrophy, and overall cellular health.',
    imageUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80'
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
      'Provides clinical-grade accuracy for TRT and peptide monitoring'
    ],
    specs: [
      { label: 'Dimensions', value: '20.7 x 33.6 x 46.3 in' },
      { label: 'Weight', value: '83.8 lbs' },
      { label: 'Testing Time', value: '60 Seconds' },
      { label: 'Frequencies', value: '1, 5, 50, 250, 500, 1000, 2000 kHz' },
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
      'Hypertrophy Program Tracking',
      'Hormone Optimization Monitoring',
      'Athletic Performance Evaluation'
    ],
    compliance: 'FDA Class II Medical Device',
    conversionType: 'inquiry',
    targetSpecialties: ['Men\'s Health', 'Hormone Therapy', 'Sports Medicine'],
    isPopular: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 128,
    inventory: 50,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'bpc-157-tb-500',
    vendorId: 'precision-compounding',
    vendorName: 'Precision Compounding Pharmacy',
    name: 'BPC-157 / TB-500 Recovery Blend',
    slug: 'bpc-157-tb-500',
    category: 'peptides',
    subCategory: 'Recovery Peptides',
    price: 185,
    priceDisplay: '$185 / vial',
    description: 'Clinical-grade peptide blend for accelerated tissue repair and recovery.',
    detailedDescription: 'A potent combination of BPC-157 (Body Protection Compound) and TB-500 (Thymosin Beta-4) designed to accelerate healing of tendons, ligaments, and muscle tissue. Ideal for sports medicine and men\'s health clinics focusing on performance recovery.',
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80'
    ],
    features: [
      'Lyophilized Powder for Reconstitution',
      'High Purity (>99%)',
      'Third-Party Tested',
      'Cold-Chain Shipping'
    ],
    benefits: [
      'Accelerates healing of acute injuries',
      'Reduces systemic inflammation',
      'Improves joint mobility and recovery time'
    ],
    specs: [
      { label: 'Dosage', value: '5mg BPC-157 / 5mg TB-500 per vial' },
      { label: 'Storage', value: 'Refrigerated after reconstitution' }
    ],
    requirements: [
      'Physician Prescription Required',
      'Clinic Account Approval'
    ],
    useCases: [
      'Sports Injury Recovery',
      'Post-Surgical Healing',
      'Chronic Joint Pain Management'
    ],
    compliance: '503A Compounding Pharmacy',
    conversionType: 'approval',
    targetSpecialties: ['Sports Medicine', 'Orthopedics', 'Men\'s Health'],
    isPopular: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 342,
    inventory: 500,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'comprehensive-male-panel',
    vendorId: 'novalyte-diagnostics',
    vendorName: 'Novalyte Diagnostics',
    name: 'Comprehensive Male Optimization Panel',
    slug: 'comprehensive-male-panel',
    category: 'diagnostics',
    subCategory: 'Blood Panels',
    price: 149,
    priceDisplay: '$149 / panel',
    description: 'Extensive blood panel covering 40+ biomarkers essential for men\'s health optimization.',
    detailedDescription: 'The definitive diagnostic tool for men\'s health clinics. This panel covers total and free testosterone, estradiol, SHBG, comprehensive metabolic panel, lipid profile, thyroid function, and key micronutrients to establish a baseline for optimization protocols.',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80'
    ],
    features: [
      '40+ Biomarkers Analyzed',
      'Nationwide Draw Center Access',
      'API Integration for EMRs',
      'White-Label Reporting Available'
    ],
    benefits: [
      'Establishes clear clinical baselines',
      'Identifies hidden optimization opportunities',
      'Streamlines patient onboarding process'
    ],
    specs: [
      { label: 'Sample Type', value: 'Venous Blood Draw' },
      { label: 'Turnaround Time', value: '3-5 Business Days' }
    ],
    requirements: [
      'Physician Authorization Required'
    ],
    useCases: [
      'TRT Baseline Assessment',
      'Annual Optimization Checkup',
      'Performance Plateau Investigation'
    ],
    compliance: 'CLIA Certified Lab Network',
    conversionType: 'assessment',
    targetSpecialties: ['Men\'s Health', 'Endocrinology', 'Primary Care'],
    isPopular: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 890,
    inventory: 10000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'shockwave-pro-x',
    vendorId: 'pulse-medical',
    vendorName: 'Pulse Medical Devices',
    name: 'Shockwave Pro X',
    slug: 'shockwave-pro-x',
    category: 'equipment',
    subCategory: 'Acoustic Wave Therapy',
    price: 14500,
    priceDisplay: '$14,500',
    description: 'Clinical-grade focused shockwave therapy device for ED and musculoskeletal treatments.',
    detailedDescription: 'The Shockwave Pro X delivers focused low-intensity extracorporeal shockwave therapy (Li-ESWT). It is a highly profitable addition to men\'s health clinics, offering non-invasive treatment for erectile dysfunction and chronic pain conditions by stimulating angiogenesis.',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80'
    ],
    features: [
      'Focused Acoustic Waves',
      'Adjustable Penetration Depth',
      'Pre-set Clinical Protocols',
      'Ergonomic Applicator'
    ],
    benefits: [
      'High-margin, cash-pay service',
      'Non-invasive ED treatment alternative',
      'High patient satisfaction rates'
    ],
    specs: [
      { label: 'Energy Range', value: '0.01 - 0.55 mJ/mm²' },
      { label: 'Frequency', value: '1 - 8 Hz' },
      { label: 'Lifespan', value: '2 Million Shocks per Applicator' }
    ],
    requirements: [
      'Clinic Approval Required',
      'Medical Director Oversight'
    ],
    useCases: [
      'Erectile Dysfunction (ED)',
      'Peyronie\'s Disease',
      'Tendinopathies'
    ],
    compliance: 'FDA Cleared Device',
    conversionType: 'inquiry',
    targetSpecialties: ['Urology', 'Men\'s Health', 'Orthopedics'],
    isPopular: false,
    isNew: true,
    rating: 4.7,
    reviewCount: 45,
    inventory: 15,
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