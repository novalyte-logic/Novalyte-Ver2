import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read config
const configPath = path.resolve(__dirname, '../firebase-applet-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const vendors = [
  {
    companyName: "NeuroTech Systems",
    logoUrl: "https://picsum.photos/seed/neurotech/200/200",
    description: "Advanced diagnostic and cognitive assessment tools.",
    website: "https://neurotech.example.com",
    contactEmail: "sales@neurotech.example.com",
    rating: 4.9,
    status: "Active"
  },
  {
    companyName: "Apex Clinical",
    logoUrl: "https://picsum.photos/seed/apex/200/200",
    description: "Premium capital equipment for optimization clinics.",
    website: "https://apex.example.com",
    contactEmail: "sales@apex.example.com",
    rating: 4.8,
    status: "Active"
  },
  {
    companyName: "Vitality Labs",
    logoUrl: "https://picsum.photos/seed/vitality/200/200",
    description: "Clinical-grade peptides and hormone optimization supplies.",
    website: "https://vitality.example.com",
    contactEmail: "sales@vitality.example.com",
    rating: 4.9,
    status: "Active"
  }
];

const products = [
  {
    vendorName: "Apex Clinical",
    name: "InBody 970",
    slug: "inbody-970",
    category: "Equipment",
    subCategory: "Body Composition",
    price: 22500,
    priceDisplay: "$22,500",
    description: "Advanced body composition analyzer providing detailed clinical insights into muscle mass, visceral fat, and cellular health.",
    detailedDescription: "Essential for men's health clinics tracking TRT and peptide protocol adherence. Segmental lean analysis, extracellular water ratio, and visceral fat area.",
    imageUrl: "https://picsum.photos/seed/inbody970/800/600",
    gallery: [
      "https://picsum.photos/seed/inbody970/800/600",
      "https://picsum.photos/seed/inbody1/800/600",
      "https://picsum.photos/seed/inbody2/800/600"
    ],
    specifications: {
      "Dimensions": "20.7 x 33.6 x 46.3 in",
      "Weight": "83.8 lbs",
      "Testing Time": "60 Seconds"
    },
    conversionType: "approval",
    targetSpecialties: ["TRT", "Weight Loss", "Longevity"],
    isPopular: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 128,
    inventory: 10
  },
  {
    vendorName: "Vitality Labs",
    name: "BPC-157 Recovery Protocol",
    slug: "bpc-157-protocol",
    category: "Supplies",
    subCategory: "Peptides",
    price: 350,
    priceDisplay: "$350/mo",
    description: "Clinical-grade BPC-157 peptide protocol for accelerated tissue repair and recovery.",
    detailedDescription: "Targeted peptide therapy to heal injuries faster, reduce inflammation, and promote cellular repair. Requires clinical assessment.",
    imageUrl: "https://picsum.photos/seed/bpc157/800/600",
    gallery: [
      "https://picsum.photos/seed/bpc157/800/600"
    ],
    specifications: {
      "Format": "Injectable",
      "Dosage": "Custom per assessment",
      "Duration": "30-day supply"
    },
    conversionType: "assessment",
    targetSpecialties: ["Sports Medicine", "Longevity", "TRT"],
    isPopular: true,
    isNew: true,
    rating: 4.8,
    reviewCount: 45,
    inventory: 500
  },
  {
    vendorName: "NeuroTech Systems",
    name: "Cognitive Assessment Panel",
    slug: "cognitive-assessment-panel",
    category: "Services",
    subCategory: "Diagnostics",
    price: 150,
    priceDisplay: "$150",
    description: "Comprehensive neuro-cognitive assessment for tracking brain fog and mental clarity.",
    detailedDescription: "Digital diagnostic tool to establish a cognitive baseline and track improvements during hormone or peptide therapy.",
    imageUrl: "https://picsum.photos/seed/cognitive/800/600",
    gallery: [
      "https://picsum.photos/seed/cognitive/800/600"
    ],
    specifications: {
      "Format": "Digital Assessment",
      "Duration": "15 minutes",
      "Reporting": "Instant PDF"
    },
    conversionType: "direct",
    targetSpecialties: ["Longevity", "TRT", "Mental Health"],
    isPopular: false,
    isNew: true,
    rating: 4.7,
    reviewCount: 12,
    inventory: 9999
  }
];

async function seed() {
  console.log('Seeding vendors...');
  const vendorIds: Record<string, string> = {};
  for (const vendor of vendors) {
    const docRef = await addDoc(collection(db, 'vendors'), {
      ...vendor,
      createdAt: serverTimestamp()
    });
    vendorIds[vendor.companyName] = docRef.id;
    console.log(`Added vendor ${vendor.companyName} with ID ${docRef.id}`);
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('Seeding products...');
  for (const product of products) {
    const vendorId = vendorIds[product.vendorName];
    if (vendorId) {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        vendorId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Added product ${product.name} with ID ${docRef.id}`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  console.log('Done!');
  process.exit(0);
}

seed().catch(console.error);
