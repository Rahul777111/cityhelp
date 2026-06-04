export type Status = "open" | "progress" | "resolved";

export type Report = {
  id: string;
  title: string;
  category: string;
  description: string;
  area: string;
  status: Status;
  priority: "low" | "medium" | "high";
  upvotes: number;
  createdAt: number;
  // normalized 0-100 coords for the fallback grid map
  x: number;
  y: number;
  // real-world coordinates for the Leaflet map
  lat: number;
  lng: number;
  timeline: { label: string; at: number }[];
};

// Real Hyderabad coordinates per area
export const AREA_COORDS: Record<string, { lat: number; lng: number }> = {
  "Banjara Hills": { lat: 17.4126, lng: 78.448 },
  Gachibowli: { lat: 17.4401, lng: 78.3489 },
  Madhapur: { lat: 17.4483, lng: 78.3915 },
  Kukatpally: { lat: 17.4948, lng: 78.3996 },
  Secunderabad: { lat: 17.4399, lng: 78.4983 },
  "Jubilee Hills": { lat: 17.4313, lng: 78.407 },
  Begumpet: { lat: 17.444, lng: 78.4616 },
  Ameerpet: { lat: 17.4374, lng: 78.4487 },
};

export const CITY_CENTER = { lat: 17.44, lng: 78.43 };

export const CATEGORIES = [
  { id: "pothole", label: "Pothole", icon: "Road" },
  { id: "streetlight", label: "Street light", icon: "Lightbulb" },
  { id: "garbage", label: "Garbage", icon: "Trash" },
  { id: "water", label: "Water supply", icon: "Drop" },
  { id: "drainage", label: "Drainage", icon: "Waves" },
  { id: "electricity", label: "Power outage", icon: "Lightning" },
  { id: "traffic", label: "Traffic signal", icon: "TrafficSign" },
  { id: "park", label: "Park & trees", icon: "Tree" },
];

export const AREAS = [
  "Banjara Hills",
  "Gachibowli",
  "Madhapur",
  "Kukatpally",
  "Secunderabad",
  "Jubilee Hills",
  "Begumpet",
  "Ameerpet",
];

export const SERVICES = [
  { name: "Police", number: "100", desc: "Emergency police response", group: "Emergency" },
  { name: "Ambulance", number: "108", desc: "Medical emergency and ambulance", group: "Emergency" },
  { name: "Fire", number: "101", desc: "Fire and rescue services", group: "Emergency" },
  { name: "Disaster Mgmt", number: "1077", desc: "District disaster control room", group: "Emergency" },
  { name: "Water Board", number: "155313", desc: "Water supply complaints (HMWSSB)", group: "Utilities" },
  { name: "Electricity", number: "1912", desc: "Power outages and billing (TSSPDCL)", group: "Utilities" },
  { name: "Municipal (GHMC)", number: "040-21111111", desc: "Civic issues and sanitation", group: "Utilities" },
  { name: "Gas Leak", number: "1906", desc: "LPG and pipeline gas emergencies", group: "Utilities" },
  { name: "Women Helpline", number: "181", desc: "Women safety and support", group: "Support" },
  { name: "Child Helpline", number: "1098", desc: "Child protection and welfare", group: "Support" },
  { name: "Senior Citizens", number: "14567", desc: "Elder helpline and assistance", group: "Support" },
  { name: "Cyber Crime", number: "1930", desc: "Report online fraud and cybercrime", group: "Support" },
];

let SEED_COUNTER = 0;
function id() {
  SEED_COUNTER += 1;
  return `seed-${SEED_COUNTER}`;
}

const now = Date.now();
const day = 86400000;

export const SEED_REPORTS: Report[] = [
  {
    id: id(),
    title: "Large pothole near Road No. 12",
    category: "pothole",
    description:
      "A deep pothole has formed at the junction, damaging vehicles and slowing traffic during peak hours.",
    area: "Banjara Hills",
    status: "progress",
    priority: "high",
    upvotes: 47,
    createdAt: now - day * 4,
    x: 28,
    y: 34,
    lat: 17.4126,
    lng: 78.448,
    timeline: [
      { label: "Reported", at: now - day * 4 },
      { label: "Acknowledged by GHMC", at: now - day * 3 },
      { label: "Repair crew assigned", at: now - day * 1 },
    ],
  },
  {
    id: id(),
    title: "Street light out for a week",
    category: "streetlight",
    description: "The entire stretch outside the community park has been dark, raising safety concerns at night.",
    area: "Gachibowli",
    status: "open",
    priority: "medium",
    upvotes: 23,
    createdAt: now - day * 2,
    x: 62,
    y: 58,
    lat: 17.4401,
    lng: 78.3489,
    timeline: [{ label: "Reported", at: now - day * 2 }],
  },
  {
    id: id(),
    title: "Overflowing garbage bins",
    category: "garbage",
    description: "Bins near the market have not been cleared in days; stray animals are scattering waste.",
    area: "Madhapur",
    status: "resolved",
    priority: "medium",
    upvotes: 38,
    createdAt: now - day * 8,
    x: 54,
    y: 41,
    lat: 17.4483,
    lng: 78.3915,
    timeline: [
      { label: "Reported", at: now - day * 8 },
      { label: "Sanitation team notified", at: now - day * 7 },
      { label: "Cleared and resolved", at: now - day * 6 },
    ],
  },
  {
    id: id(),
    title: "No water supply since morning",
    category: "water",
    description: "Several apartments report zero water pressure since 6 AM with no prior notice.",
    area: "Kukatpally",
    status: "progress",
    priority: "high",
    upvotes: 61,
    createdAt: now - day * 1,
    x: 40,
    y: 18,
    lat: 17.4948,
    lng: 78.3996,
    timeline: [
      { label: "Reported", at: now - day * 1 },
      { label: "Water board acknowledged", at: now - day * 0.6 },
    ],
  },
  {
    id: id(),
    title: "Blocked drainage causing flooding",
    category: "drainage",
    description: "Monsoon runoff is pooling at the underpass because the storm drain is clogged with debris.",
    area: "Secunderabad",
    status: "open",
    priority: "high",
    upvotes: 52,
    createdAt: now - day * 3,
    x: 73,
    y: 28,
    lat: 17.4399,
    lng: 78.4983,
    timeline: [{ label: "Reported", at: now - day * 3 }],
  },
  {
    id: id(),
    title: "Frequent power cuts in the evening",
    category: "electricity",
    description: "Daily outages between 7 and 9 PM are disrupting work-from-home residents.",
    area: "Jubilee Hills",
    status: "progress",
    priority: "medium",
    upvotes: 29,
    createdAt: now - day * 5,
    x: 20,
    y: 52,
    lat: 17.4313,
    lng: 78.407,
    timeline: [
      { label: "Reported", at: now - day * 5 },
      { label: "TSSPDCL inspecting transformer", at: now - day * 2 },
    ],
  },
  {
    id: id(),
    title: "Traffic signal stuck on red",
    category: "traffic",
    description: "The signal at the main crossing is malfunctioning, causing long jams and near misses.",
    area: "Begumpet",
    status: "resolved",
    priority: "high",
    upvotes: 44,
    createdAt: now - day * 10,
    x: 66,
    y: 72,
    lat: 17.444,
    lng: 78.4616,
    timeline: [
      { label: "Reported", at: now - day * 10 },
      { label: "Traffic police on site", at: now - day * 9 },
      { label: "Signal repaired", at: now - day * 9 },
    ],
  },
  {
    id: id(),
    title: "Fallen tree blocking footpath",
    category: "park",
    description: "A tree came down after the storm and is blocking the pedestrian path near the school.",
    area: "Ameerpet",
    status: "open",
    priority: "low",
    upvotes: 16,
    createdAt: now - day * 1.5,
    x: 46,
    y: 64,
    lat: 17.4374,
    lng: 78.4487,
    timeline: [{ label: "Reported", at: now - day * 1.5 }],
  },
];
