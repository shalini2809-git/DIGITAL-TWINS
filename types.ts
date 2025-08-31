
export enum View {
  Dashboard = 'Dashboard',
  Assets = 'Assets',
  Simulations = 'Simulations',
  Analysis = 'Analysis',
  Risks = 'Risks',
  Reports = 'Reports',
  Support = 'Support',
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  status: 'Online' | 'Offline' | 'Warning';
  specifications: { key: string; value: string }[];
  dimensions: string;
  operationalParameters: { key: string; value: string }[];
  performance: number; // e.g., OEE percentage
}

export interface Risk {
    id: string;
    description: string;
    assetId: string;
    assetName: string;
    probability: 'Low' | 'Medium' | 'High';
    impact: 'Low' | 'Medium' | 'High';
    mitigation: string;
}

export interface SimulationResult {
    time: number;
    value: number;
}

export interface PredictiveAnalysis {
    failureMode: string;
    timeframe: string;
    recommendation: string;
}

export type NotificationType = 'WARN' | 'INFO' | 'FAIL';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
}

export interface User {
  name: string;
  email: string;
}