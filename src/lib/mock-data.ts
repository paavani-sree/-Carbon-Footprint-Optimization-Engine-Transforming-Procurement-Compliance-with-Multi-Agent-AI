// User roles
export type UserRole = 'procurement' | 'sustainability' | 'supplier' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export const mockUsers: Record<UserRole, User> = {
  procurement: {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'procurement',
  },
  sustainability: {
    id: '2',
    name: 'Michael Torres',
    email: 'michael.t@company.com',
    role: 'sustainability',
  },
  supplier: {
    id: '3',
    name: 'EcoMaterials Inc.',
    email: 'contact@ecomaterials.com',
    role: 'supplier',
  },
  admin: {
    id: '4',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin',
  },
};

// KPI Data
export const procurementKPIs = {
  totalProcurements: 1247,
  carbonFootprint: 45623, // kg CO2e
  lowCarbonRatio: 68.5, // %
  costSavings: 234500, // $
  monthlyChange: {
    procurements: 12.3,
    carbonFootprint: -8.4,
    lowCarbonRatio: 5.2,
    costSavings: 15.7,
  },
};

export const sustainabilityKPIs = {
  totalEmissions: 1245.8, // tonnes CO2e
  complianceScore: 94.2, // %
  violations: 3,
  suppliersCompliant: 87, // %
  monthlyChange: {
    emissions: -12.5,
    compliance: 2.1,
    violations: -2,
    suppliers: 4.3,
  },
};

export const supplierKPIs = {
  emissionsReported: 234.5, // tonnes CO2e
  sustainabilityScore: 78,
  ordersProcessed: 156,
  certifications: 4,
};

// Chart Data
export const emissionsTrend = [
  { month: 'Jan', emissions: 1450, target: 1400 },
  { month: 'Feb', emissions: 1380, target: 1350 },
  { month: 'Mar', emissions: 1290, target: 1300 },
  { month: 'Apr', emissions: 1350, target: 1250 },
  { month: 'May', emissions: 1180, target: 1200 },
  { month: 'Jun', emissions: 1245, target: 1150 },
];

export const emissionsByCategory = [
  { name: 'Raw Materials', value: 35, color: 'hsl(168, 76%, 32%)' },
  { name: 'Transportation', value: 28, color: 'hsl(160, 84%, 39%)' },
  { name: 'Manufacturing', value: 22, color: 'hsl(142, 76%, 36%)' },
  { name: 'Packaging', value: 10, color: 'hsl(38, 92%, 50%)' },
  { name: 'Other', value: 5, color: 'hsl(215, 20%, 65%)' },
];

export const supplierComparison = [
  { name: 'EcoMaterials', emissions: 234, score: 92 },
  { name: 'GreenSupply Co', emissions: 312, score: 85 },
  { name: 'SustainTech', emissions: 189, score: 94 },
  { name: 'BluePlanet Ltd', emissions: 445, score: 71 },
  { name: 'CarbonLite Inc', emissions: 267, score: 88 },
];

// Procurement Table Data
export interface Procurement {
  id: string;
  item: string;
  supplier: string;
  quantity: number;
  carbonImpact: number; // kg CO2e
  status: 'approved' | 'pending' | 'flagged';
  date: string;
  alternative?: string;
}

export const recentProcurements: Procurement[] = [
  { id: 'PO-001', item: 'Steel Components', supplier: 'MetalWorks Inc', quantity: 500, carbonImpact: 2450, status: 'approved', date: '2024-01-15' },
  { id: 'PO-002', item: 'Plastic Packaging', supplier: 'PackageCo', quantity: 10000, carbonImpact: 890, status: 'flagged', date: '2024-01-14', alternative: 'Recycled Cardboard' },
  { id: 'PO-003', item: 'Electronic Parts', supplier: 'TechSupply', quantity: 200, carbonImpact: 1200, status: 'pending', date: '2024-01-14' },
  { id: 'PO-004', item: 'Organic Cotton', supplier: 'EcoTextiles', quantity: 300, carbonImpact: 145, status: 'approved', date: '2024-01-13' },
  { id: 'PO-005', item: 'Aluminum Sheets', supplier: 'GreenMetal Co', quantity: 150, carbonImpact: 1890, status: 'pending', date: '2024-01-12' },
];

// AI Recommendations
export interface AIRecommendation {
  id: string;
  type: 'alternative' | 'optimization' | 'compliance';
  title: string;
  description: string;
  impact: string;
  confidence: number;
  agent: string;
}

export const aiRecommendations: AIRecommendation[] = [
  {
    id: 'rec-1',
    type: 'alternative',
    title: 'Switch to Recycled Steel',
    description: 'Replace virgin steel with recycled alternatives from certified suppliers.',
    impact: '-35% carbon emissions',
    confidence: 94,
    agent: 'Optimization Agent',
  },
  {
    id: 'rec-2',
    type: 'optimization',
    title: 'Consolidate Shipments',
    description: 'Combine orders from MetalWorks and GreenMetal to reduce transport emissions.',
    impact: '-18% transport CO2',
    confidence: 87,
    agent: 'Optimization Agent',
  },
  {
    id: 'rec-3',
    type: 'compliance',
    title: 'Update Packaging Standards',
    description: 'Current plastic packaging may not meet upcoming EU regulations.',
    impact: 'Compliance risk',
    confidence: 92,
    agent: 'Compliance Agent',
  },
];

// Violations
export interface Violation {
  id: string;
  supplier: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  date: string;
  status: 'open' | 'investigating' | 'resolved';
}

export const violations: Violation[] = [
  { id: 'V-001', supplier: 'PackageCo', type: 'Emission threshold exceeded', severity: 'high', date: '2024-01-14', status: 'open' },
  { id: 'V-002', supplier: 'ChemSupply Ltd', type: 'Missing certification', severity: 'medium', date: '2024-01-10', status: 'investigating' },
  { id: 'V-003', supplier: 'FastLogistics', type: 'Transport emission spike', severity: 'low', date: '2024-01-08', status: 'resolved' },
];

// AI Agents Status
export interface AIAgent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'processing';
  lastRun: string;
  tasksCompleted: number;
  description: string;
}

export const aiAgents: AIAgent[] = [
  { id: 'agent-1', name: 'Data Collection Agent', status: 'active', lastRun: '2 min ago', tasksCompleted: 1247, description: 'Aggregates procurement and emission data from multiple sources' },
  { id: 'agent-2', name: 'Emission Analysis Agent', status: 'processing', lastRun: 'Now', tasksCompleted: 892, description: 'Analyzes carbon footprint and identifies high-impact areas' },
  { id: 'agent-3', name: 'Compliance Agent', status: 'active', lastRun: '15 min ago', tasksCompleted: 456, description: 'Monitors regulatory compliance and flags violations' },
  { id: 'agent-4', name: 'Optimization Agent', status: 'idle', lastRun: '1 hour ago', tasksCompleted: 234, description: 'Generates low-carbon alternatives and optimization strategies' },
];

// Admin Users List
export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  lastLogin: string;
}

export const systemUsers: SystemUser[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'procurement', status: 'active', lastLogin: '2024-01-15 09:30' },
  { id: '2', name: 'Michael Torres', email: 'michael.t@company.com', role: 'sustainability', status: 'active', lastLogin: '2024-01-15 08:45' },
  { id: '3', name: 'EcoMaterials Inc.', email: 'contact@ecomaterials.com', role: 'supplier', status: 'active', lastLogin: '2024-01-14 16:20' },
  { id: '4', name: 'James Wilson', email: 'j.wilson@company.com', role: 'procurement', status: 'inactive', lastLogin: '2024-01-10 11:00' },
  { id: '5', name: 'Green Supply Co', email: 'info@greensupply.com', role: 'supplier', status: 'active', lastLogin: '2024-01-15 10:15' },
];
