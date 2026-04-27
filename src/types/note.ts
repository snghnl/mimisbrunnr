export interface WikiLink {
  target: string;
  alias?: string;
  resolved: boolean;
}

export interface Note {
  id: string;
  path: string;
  title: string;
  content: string;
  frontmatter: Record<string, unknown>;
  tags: string[];
  links: WikiLink[];
  backlinks: string[];
  createdAt: Date;
  updatedAt: Date;
  embedding?: number[];
}
