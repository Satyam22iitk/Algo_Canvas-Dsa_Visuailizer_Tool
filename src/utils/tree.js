export class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.id = Math.random().toString(36).substr(2, 9);
    this.x = 0;
    this.y = 0;
    this.highlighted = false;
  }
}

export const initTreeState = {
  status: '',
  currentNode: null,
  visitedNodes: [],
  stack: [],
  queue: [],
  traversalPath: [],
  depth: 0,
  rotation: null
};

export const generateRandomTree = (size = 7) => {
  // Generate an array of unique random values
  const values = Array.from({ length: 90 }, (_, i) => i + 10)
    .sort(() => Math.random() - 0.5)
    .slice(0, size);
  
  let root = null;
  
  values.forEach(value => {
    root = insertBST(root, value);
  });
  
  return root;
};

export const insertBST = (root, value) => {
  if (!root) return new TreeNode(value);
  
  if (value < root.value) {
    root.left = insertBST(root.left, value);
  } else if (value > root.value) {
    root.right = insertBST(root.right, value);
  }
  
  return root;
};

export const calculateTreeLayout = (root, width, startY = 80, horizontalSpacing = 120, verticalSpacing = 100) => {
  if (!root) return null;
  
  // First pass: calculate positions using depth
  const positionNodes = (node, depth) => {
    if (!node) return;
    
    if (node.left) {
      positionNodes(node.left, depth + 1);
    }
    
    node.y = startY + depth * verticalSpacing;
    
    if (node.right) {
      positionNodes(node.right, depth + 1);
    }
  };
  
  positionNodes(root, 0);
  
  // Second pass: calculate x positions with centering
  const calculateX = (node, minX, maxX) => {
    if (!node) return;
    
    // Position current node at midpoint
    node.x = (minX + maxX) / 2;
    
    // Position children
    if (node.left) {
      calculateX(node.left, minX, node.x - horizontalSpacing);
    }
    if (node.right) {
      calculateX(node.right, node.x + horizontalSpacing, maxX);
    }
  };
  
  // Calculate total tree width
  const treeHeight = calculateTreeHeight(root);
  const maxWidth = Math.pow(2, treeHeight - 1) * horizontalSpacing;
  calculateX(root, 0, maxWidth);
  
  // Center the entire tree
  const minX = Math.min(...getAllNodes(root).map(n => n.x));
  const maxX = Math.max(...getAllNodes(root).map(n => n.x));
  const offset = (width - (maxX - minX)) / 2 - minX;
  
  getAllNodes(root).forEach(node => {
    node.x += offset;
  });
  
  return root;
};

export const getAllNodes = (root) => {
  const nodes = [];
  const traverse = (node) => {
    if (!node) return;
    nodes.push(node);
    traverse(node.left);
    traverse(node.right);
  };
  traverse(root);
  return nodes;
};

export const calculateTreeHeight = (node) => {
  if (!node) return 0;
  return 1 + Math.max(
    calculateTreeHeight(node.left), 
    calculateTreeHeight(node.right)
  );
};

export const treeToArray = (root) => {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length) {
    const levelSize = queue.length;
    const level = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      if (node) {
        level.push(node.value);
        queue.push(node.left);
        queue.push(node.right);
      } else {
        level.push(null);
      }
    }
    
    // Add level only if it contains non-null values
    if (level.some(val => val !== null)) {
      result.push(...level);
    }
  }
  
  return result;
};

export const getNodeByValue = (root, value) => {
  if (!root) return null;
  
  if (root.value === value) return root;
  
  const leftResult = getNodeByValue(root.left, value);
  if (leftResult) return leftResult;
  
  return getNodeByValue(root.right, value);
};

// Additional utility functions
export const findMinNode = (node) => {
  while (node && node.left) {
    node = node.left;
  }
  return node;
};

export const deleteNode = (root, value) => {
  if (!root) return null;

  if (value < root.value) {
    root.left = deleteNode(root.left, value);
  } else if (value > root.value) {
    root.right = deleteNode(root.right, value);
  } else {
    // Node with only one child or no child
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    
    // Node with two children
    const temp = findMinNode(root.right);
    root.value = temp.value;
    root.right = deleteNode(root.right, temp.value);
  }
  
  return root;
};

export const searchBST = (root, value) => {
  if (!root) return null;
  
  if (root.value === value) return root;
  
  if (value < root.value) {
    return searchBST(root.left, value);
  } else {
    return searchBST(root.right, value);
  }
};