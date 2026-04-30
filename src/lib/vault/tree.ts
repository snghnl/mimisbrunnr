export interface NoteNode {
  kind: 'note';
  name: string;
  path: string;
}

export interface FolderNode {
  kind: 'folder';
  name: string;
  path: string;
  children: VaultNode[];
}

export type VaultNode = NoteNode | FolderNode;

export function buildTree(paths: string[]): VaultNode[] {
  const root: VaultNode[] = [];

  for (const path of paths) {
    const parts = path.split('/');
    let nodes = root;
    let currentPath = '';

    for (let i = 0; i < parts.length - 1; i++) {
      const segment = parts[i];
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      let folder = nodes.find(
        (n): n is FolderNode => n.kind === 'folder' && n.name === segment,
      );
      if (!folder) {
        folder = { kind: 'folder', name: segment, path: currentPath, children: [] };
        nodes.push(folder);
      }
      nodes = folder.children;
    }

    const filename = parts[parts.length - 1];
    const name = filename.endsWith('.md') ? filename.slice(0, -3) : filename;
    nodes.push({ kind: 'note', name, path });
  }

  sortNodes(root);
  return root;
}

function sortNodes(nodes: VaultNode[]): void {
  nodes.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  for (const node of nodes) {
    if (node.kind === 'folder') sortNodes(node.children);
  }
}
