
export enum Stratum {
  EMERGENT = 'Emergent',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export interface Species {
  name: string;
  scientificName?: string;
  stratum: Stratum;
  lifeCycleYears: number;
  purpose: string[];
  plantingTime: string;
}

export interface ManagementTask {
  phase: string;
  action: string;
  targetSpecies: string[];
  benefit: string;
  timing: string;
}

export interface PulseTask {
  id: string;
  time: string;
  action: string;
  sector: string;
  intensity: 'Low' | 'Medium' | 'High';
}

export interface SyntropicDesign {
  projectName: string;
  location: string;
  climate: string;
  speciesList: Species[];
  successionStrategy: string;
  managementTips: string[];
  protocols?: ManagementTask[];
}

export interface Observation {
  id: string;
  timestamp: number;
  content: string;
  category: 'Timeline' | 'Biological' | 'Ethical';
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  design?: SyntropicDesign;
}
