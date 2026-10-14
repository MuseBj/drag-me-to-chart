export interface MockDataSets {
  donut: { name: string; value: number }[];
  pie: { name: string; value: number }[];
  rose: { name: string; value: number }[];
  area: { dates: string[]; seriesA: number[]; seriesB: number[] };
  line: { dates: string[]; p95: number[]; p99: number[]; avg: number[] };
  bar: { categories: string[]; planned: number[]; actual: number[] };
  stackedBar: { months: string[]; compute: number[]; database: number[]; storage: number[]; network: number[] };
  horizontalBar: { names: string[]; values: number[] };
  heatmapCalendar: { days: string[]; hours: string[]; data: [number, number, number][] };
  heatmapMatrix: { features: string[]; matrix: [number, number, number][] };
  scatter: [number, number, number, string][]; // [cac, ltv, size, cohort]
  radar: { indicators: { name: string; max: number }[]; current: number[]; target: number[] };
  gauge: { value: number; max: number; label: string };
  funnel: { name: string; value: number }[];
  treemap: { name: string; value: number; children?: { name: string; value: number }[] }[];
  kpiSparklines: number[];
  tableRows: {
    id: string;
    target: string;
    category: string;
    value: string;
    status: 'Healthy' | 'Warning' | 'Critical' | 'Completed';
    updated: string;
  }[];
  medicalFormLatency?: { hours: string[]; latencySeconds: number[]; sloThreshold: number[] };
  medicalEmailAuth?: { name: string; value: number }[];
  medicalNapAudit?: { categories: string[]; validLinks: number[]; staleTracking: number[] };
  medicalSreRadar?: { indicators: { name: string; max: number }[]; current: number[]; target: number[] };
  medicalTableRows?: {
    id: string;
    target: string;
    category: string;
    value: string;
    status: 'Healthy' | 'Warning' | 'Critical' | 'Completed';
    updated: string;
  }[];
  medicalHeartbeatHeatmap?: { days: string[]; hours: string[]; data: [number, number, number][] };
  eventTimeline?: {
    days: string[];
    trafficHits: number[];
    crmBookings: number[];
    queueMessages: number[];
    tracks: string[];
    events: [number, number, string, string, string][]; // [dayIndex, trackIndex, title, details, colorType]
  };
}

// Generates weekly 24h heatmap data
const generateHeatmapCalendarData = (): [number, number, number][] => {
  const data: [number, number, number][] = [];
  const days = 7;
  const hours = 24;

  for (let d = 0; d < days; d++) {
    for (let h = 0; h < hours; h++) {
      // simulate workday peak between 9:00 and 18:00
      const isWorkday = d < 5;
      const isWorkHours = h >= 9 && h <= 18;
      let base = isWorkday ? (isWorkHours ? 75 : 30) : 20;
      // Add pseudo-random variance
      const variance = Math.sin(h * 0.5) * 15 + Math.cos(d * 1.2) * 10;
      const val = Math.max(5, Math.min(100, Math.round(base + variance)));
      data.push([h, d, val]);
    }
  }
  return data;
};

// Generates 6x6 correlation matrix
const generateCorrelationMatrix = (): [number, number, number][] => {
  const data: [number, number, number][] = [];
  const baseCorrelations = [
    [1.0, 0.82, -0.65, 0.45, 0.72, -0.3],
    [0.82, 1.0, -0.58, 0.38, 0.68, -0.22],
    [-0.65, -0.58, 1.0, -0.85, -0.42, 0.78],
    [0.45, 0.38, -0.85, 1.0, 0.55, -0.61],
    [0.72, 0.68, -0.42, 0.55, 1.0, -0.15],
    [-0.3, -0.22, 0.78, -0.61, -0.15, 1.0],
  ];

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      data.push([i, j, baseCorrelations[i][j]]);
    }
  }
  return data;
};

export const MOCK_DATA: MockDataSets = {
  donut: [
    { name: 'Enterprise Elite', value: 45200 },
    { name: 'Growth Tier', value: 32400 },
    { name: 'Pro Standard', value: 21800 },
    { name: 'Startup Team', value: 14500 },
    { name: 'Community Free', value: 8900 },
  ],
  pie: [
    { name: 'Direct Traffic', value: 42.5 },
    { name: 'Organic Search', value: 28.3 },
    { name: 'Partner Referrals', value: 16.2 },
    { name: 'Social Campaigns', value: 8.4 },
    { name: 'Email Broadcasts', value: 4.6 },
  ],
  rose: [
    { name: 'North America East', value: 85 },
    { name: 'Western Europe', value: 72 },
    { name: 'Asia Pacific (Tokyo/Sing)', value: 64 },
    { name: 'North America West', value: 58 },
    { name: 'Latin America', value: 42 },
    { name: 'Middle East & Africa', value: 35 },
    { name: 'Northern Europe', value: 29 },
  ],
  area: {
    dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    seriesA: [42, 51, 68, 85, 98, 124, 142, 168, 195, 230, 268, 310],
    seriesB: [28, 35, 42, 53, 62, 78, 91, 108, 125, 148, 172, 198],
  },
  line: {
    dates: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'],
    p95: [18, 22, 38, 94, 112, 105, 88, 52, 24],
    p99: [42, 48, 65, 185, 240, 210, 165, 95, 52],
    avg: [12, 14, 21, 58, 68, 62, 51, 32, 16],
  },
  bar: {
    categories: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'],
    planned: [450, 520, 610, 750, 820, 950],
    actual: [482, 560, 595, 810, 890, 1020],
  },
  stackedBar: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    compute: [3200, 3600, 4100, 4800, 5200, 5900],
    database: [1800, 2100, 2300, 2700, 3000, 3400],
    storage: [950, 1100, 1300, 1500, 1750, 2000],
    network: [620, 710, 840, 980, 1150, 1300],
  },
  horizontalBar: {
    names: [
      'Sarah Jenkins (Global AE)',
      'Marcus Vance (Enterprise)',
      'Elena Rostova (EMEA)',
      'David Kalu (APAC Lead)',
      'Rachel Zhang (Growth)',
      'Carlos Mendez (LatAm)',
    ],
    values: [1420, 1280, 1150, 980, 860, 720],
  },
  heatmapCalendar: {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    hours: [
      '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11',
      '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23',
    ],
    data: generateHeatmapCalendarData(),
  },
  heatmapMatrix: {
    features: ['Latency', 'Error Rate', 'CPU Load', 'RAM Usage', 'Throughput', 'Disk IOPS'],
    matrix: generateCorrelationMatrix(),
  },
  scatter: [
    [120, 840, 34, 'Enterprise'],
    [180, 920, 42, 'Enterprise'],
    [240, 1350, 58, 'Enterprise'],
    [95, 480, 22, 'Growth'],
    [110, 560, 28, 'Growth'],
    [85, 390, 18, 'Growth'],
    [45, 210, 12, 'Pro'],
    [55, 240, 15, 'Pro'],
    [35, 160, 10, 'Starter'],
    [40, 180, 11, 'Starter'],
    [25, 90, 8, 'Free/Self'],
    [30, 110, 9, 'Free/Self'],
  ],
  radar: {
    indicators: [
      { name: 'Security & Auth', max: 100 },
      { name: 'Throughput Speed', max: 100 },
      { name: 'Fault Tolerance', max: 100 },
      { name: 'Code Coverage', max: 100 },
      { name: 'UI Responsiveness', max: 100 },
      { name: 'API Latency SLA', max: 100 },
    ],
    current: [92, 88, 95, 78, 94, 91],
    target: [95, 95, 99, 90, 95, 98],
  },
  gauge: {
    value: 99.94,
    max: 100,
    label: '99.94% Uptime',
  },
  funnel: [
    { name: '1. Landing Page Visitors', value: 100000 },
    { name: '2. Created Account', value: 42000 },
    { name: '3. Completed Onboarding', value: 24500 },
    { name: '4. Initiated 14-Day Trial', value: 12800 },
    { name: '5. Paid Contract Conversion', value: 5850 },
  ],
  treemap: [
    {
      name: 'Production Cluster US-East',
      value: 620,
      children: [
        { name: 'k8s-worker-pool-a', value: 280 },
        { name: 'postgres-primary-db', value: 210 },
        { name: 'redis-cache-cluster', value: 130 },
      ],
    },
    {
      name: 'EU-Central Infrastructure',
      value: 380,
      children: [
        { name: 'k8s-worker-pool-eu', value: 220 },
        { name: 'read-replica-db', value: 160 },
      ],
    },
    {
      name: 'Staging & Sandbox',
      value: 160,
      children: [
        { name: 'ci-runner-fleet', value: 100 },
        { name: 'ephemeral-test-envs', value: 60 },
      ],
    },
  ],
  kpiSparklines: [24, 28, 26, 32, 30, 38, 42, 39, 48, 54, 52, 60],
  tableRows: [
    { id: 'INV-9021', target: 'Acme Global Corp', category: 'Enterprise Tier', value: '$24,500.00', status: 'Healthy', updated: '2 mins ago' },
    { id: 'INV-9022', target: 'Starlight Tech Inc', category: 'Growth Cloud', value: '$8,200.00', status: 'Healthy', updated: '14 mins ago' },
    { id: 'INV-9023', target: 'Nexus Media Lab', category: 'Pro Annual', value: '$3,850.00', status: 'Warning', updated: '45 mins ago' },
    { id: 'INV-9024', target: 'CyberGrid Systems', category: 'Enterprise Dedicated', value: '$48,000.00', status: 'Healthy', updated: '1 hour ago' },
    { id: 'INV-9025', target: 'BioPulse Analytics', category: 'HIPAA Cloud', value: '$19,400.00', status: 'Completed', updated: '3 hours ago' },
    { id: 'INV-9026', target: 'Apex Logistics LLC', category: 'Growth Tier', value: '$6,150.00', status: 'Critical', updated: '5 hours ago' },
  ],
  medicalFormLatency: {
    hours: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
    latencySeconds: [28, 31, 26, 29, 34, 42, 38, 32, 29, 35, 41, 34],
    sloThreshold: [90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90],
  },
  medicalEmailAuth: [
    { name: 'DMARC Strict (p=reject)', value: 45 },
    { name: 'DKIM 2048-bit Signed', value: 30 },
    { name: 'SPF Alignment Pass', value: 20 },
    { name: 'MX Redundancy Active', value: 5 },
  ],
  medicalNapAudit: {
    categories: ['Homepage', 'Procedures', 'Doctor Bios', 'Location Hubs', 'Consult Form', 'Sticky Popups', 'Footer Links'],
    validLinks: [14, 28, 12, 18, 6, 8, 22],
    staleTracking: [0, 0, 0, 0, 0, 0, 1],
  },
  medicalSreRadar: {
    indicators: [
      { name: 'Form-to-CRM (<90s)', max: 100 },
      { name: 'Intake Line Rate (100%)', max: 100 },
      { name: 'NAP Consistency (100%)', max: 100 },
      { name: 'Email Auth Posture', max: 100 },
      { name: 'SSL / Domain (>14d)', max: 100 },
      { name: 'Two-Way SMS ACK', max: 100 },
    ],
    current: [98, 100, 98, 100, 99, 96],
    target: [100, 100, 100, 100, 100, 100],
  },
  medicalTableRows: [
    {
      id: 'SYNTH-8102',
      target: 'Playwright Synthetic Form (Alias Sub-Address)',
      category: 'synthetics+jane.doe.20261013@mon.io',
      value: '34.2s (SLO <90s)',
      status: 'Healthy',
      updated: '12 mins ago',
    },
    {
      id: 'VOICE-8103',
      target: 'Twilio Voice Automated IVR Probe',
      category: 'Practice Main Line (DTMF "1" Tone)',
      value: '2.1s (100% SLA)',
      status: 'Completed',
      updated: '8:30 AM Today',
    },
    {
      id: 'SMS-8104',
      target: 'Twilio Two-Way SMS Line Verification',
      category: 'Inbound Coordinator ACK Receipt',
      value: '3.8m Reply Latency',
      status: 'Completed',
      updated: '8:31 AM Today',
    },
    {
      id: 'NAP-8105',
      target: 'Site Crawler Phone & Schema Audit (42 URLs)',
      category: 'JSON-LD MedicalBusiness + tel: links',
      value: '1 Legacy Footer Tracking #',
      status: 'Warning',
      updated: '1 hour ago',
    },
    {
      id: 'DMARC-8106',
      target: 'DNS Email Deliverability & Auth Guardrail',
      category: 'SPF, DKIM 2048, DMARC p=reject',
      value: '100% Strict Pass',
      status: 'Healthy',
      updated: '3 hours ago',
    },
    {
      id: 'SSL-8107',
      target: 'TLS Wildcard & Whois Registrar Expiry',
      category: 'Domain & Certificate Buffer Check',
      value: '74 Days Buffer (>14d SLO)',
      status: 'Healthy',
      updated: '6 hours ago',
    },
  ],
  eventTimeline: {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    trafficHits: [1420, 5240, 3180, 2150, 6890, 7420, 2980],
    crmBookings: [12, 48, 29, 18, 62, 71, 24],
    queueMessages: [15, 168, 42, 18, 195, 235, 30],
    tracks: [
      'Host 1 (Web Gateway)',
      'Host 2 (CRM Webhook)',
      'Host 3 (Database/Queue)',
      'Email Blasts',
      'TikTok Posts',
      'Instagram Reels',
    ],
    events: [
      // Monday
      [0, 2, 'Host 3 Routine Sync', 'Nightly EHR database catalog backup & integrity validation', 'host'],
      // Tuesday (IG Reel drops -> Host 1 and Host 2 surge)
      [1, 5, 'Instagram Reel: Lip Filler Transformation', 'Viral Reel dropped at 10 AM; drove 3,820 visitors & 48 consultations', 'marketing'],
      [1, 0, 'Host 1 Scale-out Event', 'Auto-scaling triggered by sudden traffic surge to 5,240 hits/hr', 'host'],
      [1, 1, 'Host 2 Webhook Surge', 'Ingestion queue surged to 168 messages as forms poured in', 'host'],
      [1, 2, 'Host 3 Replication Event', 'Replication lag momentarily increased to 1.8s during booking rush', 'host'],
      // Wednesday (Email Blast drops)
      [2, 3, 'Email Blast: VIP Botox & Peel Special', 'Delivered to 14,200 past patients; drove 3,180 visits & 29 consults', 'marketing'],
      [2, 2, 'Host 3 Daily Sync', 'Automated nightly sync & index optimization', 'host'],
      // Thursday
      [3, 2, 'Host 3 Routine Event', 'EHR synthetic test database sweep', 'host'],
      // Friday (TikTok drops -> Host 1 and Host 3 scale)
      [4, 4, 'TikTok Video: Surgeon Reacts to Rhinoplasty Myths', '140k views in 6 hours; drove 4,740 landing page visits & 62 consults', 'marketing'],
      [4, 0, 'Host 1 Gateway Concurrency Spike', 'Connection pool expanded to handle 6,890 hits', 'host'],
      [4, 2, 'Host 3 Queue Event', 'Ingestion queue surged to 195 msgs; drained safely in 52s', 'host'],
      // Saturday (Instagram Live/Story Q&A -> Host 2 queue peak)
      [5, 5, 'Instagram Story: Live Q&A with Lead Surgeon', 'Swipe-up consult links drove 71 high-ticket surgical bookings', 'marketing'],
      [5, 1, 'Host 2 Webhook High Watermark', 'Peak CRM ingestion backlog of 235 messages; 0 drops', 'host'],
      [5, 2, 'Host 3 Weekend Archival', 'Scheduled partition archival and backup snapshot', 'host'],
      // Sunday
      [6, 2, 'Host 3 Routine Event', 'Weekly health check & telemetry roll-up', 'host'],
    ],
  },
};
