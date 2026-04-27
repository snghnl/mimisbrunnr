export interface GraphNode {
  id: string;
  label: string;
  weight: number;
  tags: string[];
  cluster?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: 'explicit' | 'semantic';
  weight: number;
}
