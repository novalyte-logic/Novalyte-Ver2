import { collection, addDoc, serverTimestamp } from '@/src/lib/supabase/firestore';
import { db } from './firebase';

const clinics = [
  {
    name: "Apex Longevity & Performance",
    specialties: ["Hormone Optimization", "Longevity & Aging", "Weight Management"],
    status: "active",
    address: "123 Performance Way",
    city: "Austin",
    state: "TX",
    zip: "78701",
    phone: "(512) 555-0123",
    email: "contact@apexlongevity.com",
    website: "https://apexlongevity.com",
    rating: 4.9,
    reviewCount: 124,
    pricingTier: "elite",
    acceptsInsurance: false,
    createdAt: serverTimestamp()
  },
  {
    name: "Vitality Men's Health",
    specialties: ["Hormone Optimization", "General Wellness"],
    status: "active",
    address: "456 Vitality Blvd",
    city: "Miami",
    state: "FL",
    zip: "33101",
    phone: "(305) 555-0456",
    email: "info@vitalitymens.com",
    website: "https://vitalitymens.com",
    rating: 4.7,
    reviewCount: 89,
    pricingTier: "standard",
    acceptsInsurance: true,
    createdAt: serverTimestamp()
  },
  {
    name: "NeuroEdge Cognitive Clinic",
    specialties: ["Cognitive Performance", "Longevity & Aging"],
    status: "active",
    address: "789 Brain Ave",
    city: "San Francisco",
    state: "CA",
    zip: "94101",
    phone: "(415) 555-0789",
    email: "hello@neuroedge.io",
    website: "https://neuroedge.io",
    rating: 4.8,
    reviewCount: 56,
    pricingTier: "premium",
    acceptsInsurance: false,
    createdAt: serverTimestamp()
  },
  {
    name: "Metabolic Mastery Center",
    specialties: ["Weight Management", "General Wellness"],
    status: "active",
    address: "101 Metabolism St",
    city: "New York",
    state: "NY",
    zip: "10001",
    phone: "(212) 555-1010",
    email: "support@metabolicmastery.com",
    website: "https://metabolicmastery.com",
    rating: 4.6,
    reviewCount: 210,
    pricingTier: "standard",
    acceptsInsurance: true,
    createdAt: serverTimestamp()
  }
];

async function seedClinics() {
  for (const clinic of clinics) {
    try {
      await addDoc(collection(db, 'clinics'), clinic);
      console.log(`Added clinic: ${clinic.name}`);
    } catch (e) {
      console.error("Error adding clinic: ", e);
    }
  }
}

seedClinics().then(() => {
  console.log("Seeding complete");
  process.exit(0);
}).catch((err) => {
  console.error("Seeding failed", err);
  process.exit(1);
});
