const fs = require('fs');

const rawData = `
Advanced TRT Clinic	Clinic Manager	N/A	N/A	Manhattan Beach, CA	Master List
Aeson Men's Health	Dr. Movassaghi	info@aesonmenshealth.com	aesonmenshealth.com	Beverly Hills	Verified Research
American Longevity Centers	Clinic Director	info@americanlongevitycenters.com	americanlongevitycenters.com	Nationwide	Verified Research
Aspen Hormone Institute	Dr. Kenton Bruice	drbruice@gmail.com	kentonbruicemd.com	Aspen, CO	Verified Research
Atlas Men's Health	Clinic Director	info@atlasmenshealthny.com	atlasmenshealth.com	Manhattan, NY	Verified Research
Cenegenics	Paul Campion, MD	info@cenegenics.com	cenegenics.com	Nationwide	Verified Research
Choice Men's Health	Decision Maker	N/A	choicemenshealth.com	GA	CSV Import
Dallas Men's Health	Founder	N/A	N/A	Dallas, TX	Master List
Dawson James Securities	N/A	N/A	N/A	Delray Beach, FL	Imported from hnw_patient_leads.csv
Elite TRT Scottsdale	Medical Director	N/A	N/A	Scottsdale, AZ	Master List
Eudēmonia Summit	N/A	N/A	N/A	West Palm Beach, FL	Imported from hnw_patient_leads.csv
FIX MY FITNESS CLUB	N/A	N/A	N/A	West Palm Beach, FL	Imported from hnw_patient_leads.csv
Florida Men's Health	Clinic Director	info@floridamenshealth.com	floridamenshealth.com	Orlando, FL	Verified Research
Fountain Life	Clinic Director	care@fountainlife.com	fountainlife.com	Nationwide	Verified Research
Gameday Men's Health	Evan Miller	evan@gamedaymenshealth.com	gamedaymenshealth.com	San Diego, CA	Verified Research
Gameday Men's Health Beverly Hills	Medical Director	N/A	N/A	Beverly Hills, CA	Master List
Gameday Men's Health Manhattan	Clinic Director	N/A	N/A	New York, NY	Master List
Gameday Men's Health Palm Beach	Medical Director	N/A	N/A	Palm Beach, FL	Master List
Gameday Men's Health West Palm	Medical Director	N/A	N/A	West Palm Beach, FL	Master List
Genesis Health	Decision Maker	N/A	genesishealthinstitute.com	WA	CSV Import
Genesis Lifestyle Medicine	Medical Director	info@genesislifestylemedicine.com	genesislifestylemedicine.com	Nationwide	Verified Research
Gents Doctor	Dr. Majid Sabour	info@gentsdoctor.com	gentsdoctor.com	Beverly Hills, CA	Verified Research
Green Dragon Investments	N/A	N/A	N/A	Little Rock, AR	Imported from hnw_patient_leads.csv
Hawke Media	N/A	N/A	N/A	Beverly Hills, CA	Imported from hnw_patient_leads.csv
Hormone Logics	Decision Maker	N/A	hormonelogics.com	FL	CSV Import
Humanaut Health	Clinic Director	hello@humanauthealth.com	humanauthealth.com	Palm Beach, FL	Verified Research
IVY Men's Health & TRT	Sasha Beatty	N/A	https://ivymenshealth.com	Greenwich, CT	Enterprise Lead
Lifestyle Men's Clinic Phoenix	Clinic Director	N/A	N/A	Phoenix, AZ	Master List
Longevity Center Beverly Hills	N/A	N/A	N/A	Beverly Hills, CA	Imported from hnw_patient_leads.csv
Longevity Health Clinic	Clinic Director	info@longevityhealthclinic.com	longevityhealthclinic.com	Charlottesville, VA	Verified Research
Low T Center	Mike Sisk	msisk@mindbodyopt.com	mindbodyopt.com	TX	Verified Research
Mantra Men's Health	Decision Maker	N/A	mantramenshealth.com	OH	CSV Import
MD Longevity	Clinic Director	info@mdlongevity.com	mdlongevity.com	NYC	Verified Research
Men's Health Georgia	Clinic Director	info@menshealthgeorgia.com	menshealthgeorgia.com	Atlanta, GA	Verified Research
Men's Revival Arizona	Founder	N/A	N/A	Scottsdale, AZ	Master List
Men's T Clinic	Dr. Kenneth Trimmer	info@menstclinic.com	menstclinic.com	TX	Verified Research
Next Health	Clinic Director	info@next-health.com	next-health.com	LA / NYC	Verified Research
Next Level Health	Medical Director	N/A	nextlevelhealth.com	FL	CSV Import
Next Level Primary Care	Dr. Brent Beadling	drbeadling@nextlevelprimarycare.com	nextlevelprimarycare.com	Jacksonville, FL	Verified Research
NuMale Medical	Clinic Director	info@numale.com	numalemedical.com	Nationwide	Verified Research
OneLife Health & Performance	N/A	N/A	N/A	Palm Beach, FL	Imported from hnw_patient_leads.csv
Peak Performance	Decision Maker	N/A	peakperformancemenshealth.com	UT	CSV Import
Peak Vitality	Clinic Director	contact@peakvitality.com	peakvitality.com	Concierge	Verified Research
Prime Health HRT	Medical Director	N/A	https://primehealthhrt.com	Palm Beach, FL	Enterprise Lead
Prime Health HRT Manhattan	Clinical Lead	N/A	N/A	Manhattan, NY	Master List
Pure BHRT Clinic	Clinic Director	info@purebhrtclinic.com	purebhrtclinic.com	Dallas, TX	Verified Research
Raffaele Medical	Clinic Director	info@raffaelemedical.com	raffaelemedical.com	NYC	Verified Research
Renew Vitality	Medical Director	info@vitalityhrt.com	vitalityhrt.com	NY / CA	Verified Research
Renew Vitality Miami	Medical Director	N/A	N/A	Miami, FL	Master List
Revibe Men's Health	Benard Brozek	info@revibemenshealth.com	revibemenshealth.com	Nationwide	Verified Research
Stealth Startup (Health Tech)	N/A	N/A	N/A	West Palm Beach, FL	Imported from hnw_patient_leads.csv
SynergenX Health	Wayne Wilson	wwilson@synergenxhealth.com	synergenxhealth.com	TX / IL	Verified Research
The CodeBreaker Mindset	N/A	N/A	N/A	Manhattan, NY	Imported from hnw_patient_leads.csv
Total Men's Primary Care	Decision Maker	N/A	totalmens.com	TX	CSV Import
Urological Consultants of Florida	Lead Urologist	N/A	N/A	Miami, FL	Master List
Viking Alternative	Sam Ridgeway	sam@vikingalternative.com	vikingalternative.com	MO / Nationwide	Verified Research
`;

const lines = rawData.trim().split('\n');
const clinics = lines.map((line, i) => {
  const [name, contact, email, website, location, source] = line.split('\t');
  
  // Filter out non-clinics
  if (name === 'N/A' || name.includes('Securities') || name.includes('Investments') || name.includes('Media') || name.includes('Startup') || name.includes('Mindset') || name.includes('Summit')) return null;

  const tagsList = ["TRT", "Peptides", "Longevity", "Weight Management", "Cognitive Health", "Hair Loss", "Hormone Optimization", "Sports Medicine", "Recovery", "Biohacking"];
  const symptomsList = ["Fatigue", "Brain Fog", "Low Libido", "Weight Gain", "Poor Sleep", "Muscle Loss", "Joint Pain", "Hair Thinning", "Stress"];
  
  const tags = [];
  const numTags = Math.floor(Math.random() * 3) + 2;
  for(let j=0; j<numTags; j++) {
    const tag = tagsList[Math.floor(Math.random() * tagsList.length)];
    if (!tags.includes(tag)) tags.push(tag);
  }

  const symptoms = [];
  const numSymptoms = Math.floor(Math.random() * 3) + 2;
  for(let j=0; j<numSymptoms; j++) {
    const symptom = symptomsList[Math.floor(Math.random() * symptomsList.length)];
    if (!symptoms.includes(symptom)) symptoms.push(symptom);
  }

  const images = [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1551076805-e18690c5e561?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1504439468489-c8920d786a2b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"
  ];

  const waitlists = ["No wait", "1-2 days", "3-5 days", "1 week", "2 weeks"];
  const prices = ["$$", "$$$", "$$$$"];

  return {
    id: `clinic_${i}`,
    name,
    location: location === 'N/A' ? 'Nationwide' : location,
    rating: (Math.random() * 1 + 4).toFixed(1),
    matchScore: Math.floor(Math.random() * 20) + 80,
    tags,
    symptoms,
    waitlist: waitlists[Math.floor(Math.random() * waitlists.length)],
    price: prices[Math.floor(Math.random() * prices.length)],
    image: images[Math.floor(Math.random() * images.length)],
    website: website !== 'N/A' ? website : undefined,
    contact: contact !== 'N/A' ? contact : undefined,
  };
}).filter(Boolean);

fs.writeFileSync('src/data/clinics.json', JSON.stringify(clinics, null, 2));
