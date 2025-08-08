// src/algorithms/tree/traversals.js
import { initTreeState } from "../../utils/tree";

let stopRequested = false;

export function stop() {
  stopRequested = true;
}

const shouldStop = () => stopRequested;

const baseTraverse = (type, algorithm) => ({
  name: `${type} Traversal`,
  code: `// ${type} Traversal (C++)
void ${type.toLowerCase()}Traversal(TreeNode* root) {
    if (!root) return;
    ${getTraversalCode(type)}
}

${getHelperCode(type)}`,
  explanation: getExplanation(type),
  complexity: {
    time: "O(n)", // Visits each node exactly once
    space: "O(h)", // Where h is height of tree (recursion stack)
  },
  visualize: (root, _, speed, updateState, onComplete) => {
    const state = { ...initTreeState };
    const steps = [];
    const path = [];

    stopRequested = false;

    const traverse = (node) => {
      if (!node || shouldStop()) return;
      algorithm(node, steps, path, root, traverse);
    };

    steps.push({
      ...state,
      tree: root,
      traversalPath: [],
      status: `Starting ${type.toLowerCase()} traversal`
    });

    traverse(root);

    if (!shouldStop()) {
      steps.push({
        ...state,
        tree: root,
        visitedNodes: [...path],
        traversalPath: [...path],
        currentNode: null,
        status: `✅ ${type} traversal completed`
      });
    } else {
      steps.push({
        ...state,
        tree: root,
        visitedNodes: [...path],
        traversalPath: [...path],
        currentNode: null,
        status: `⏹️ ${type} traversal stopped`
      });
    }

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex >= steps.length || shouldStop()) {
        clearInterval(interval);
        if (onComplete) onComplete(path);
        return;
      }
      updateState(steps[stepIndex]);
      stepIndex++;
    }, 1500 / speed);
  }
});

// Helper functions for C++ code generation
function getTraversalCode(type) {
  switch(type.toLowerCase()) {
    case 'inorder':
      return `
    // First recur on left child
    inorderTraversal(root->left);
    
    // Then process the current node
    cout << root->val << " ";
    
    // Finally recur on right child
    inorderTraversal(root->right);`;
    case 'preorder':
      return `
    // First process the current node
    cout << root->val << " ";
    
    // Then recur on left child
    preorderTraversal(root->left);
    
    // Finally recur on right child
    preorderTraversal(root->right);`;
    case 'postorder':
      return `
    // First recur on left child
    postorderTraversal(root->left);
    
    // Then recur on right child
    postorderTraversal(root->right);
    
    // Finally process the current node
    cout << root->val << " ";`;
    default:
      return '';
  }
}

function getHelperCode() {
  return " ";
}

function getExplanation(type) {
  const explanations = {
    inorder: "Visits nodes in Left-Root-Right order. For BST, this produces values in sorted order.",
    preorder: "Visits nodes in Root-Left-Right order. Useful for creating a copy of the tree.",
    postorder: "Visits nodes in Left-Right-Root order. Useful for deleting nodes safely."
  };
  return explanations[type.toLowerCase()] || "";
}

// Inorder Traversal
export const inOrderTraversal = baseTraverse("Inorder", (node, steps, path, root, traverse) => {
  steps.push({
    ...initTreeState,
    tree: root,
    currentNode: node,
    visitedNodes: [...path],
    traversalPath: [...path],
    status: `Visiting left subtree of ${node.value}`
  });
  if (node.left) traverse(node.left);

  path.push(node.value);
  steps.push({
    ...initTreeState,
    tree: root,
    currentNode: node,
    visitedNodes: [...path],
    traversalPath: [...path],
    status: `Processing node ${node.value}`
  });

  steps.push({
    ...initTreeState,
    tree: root,
    currentNode: node,
    visitedNodes: [...path],
    traversalPath: [...path],
    status: `Visiting right subtree of ${node.value}`
  });
  if (node.right) traverse(node.right);
});

// Preorder Traversal
export const preOrderTraversal = baseTraverse("Preorder", (node, steps, path, root, traverse) => {
  path.push(node.value);
  steps.push({
    ...initTreeState,
    tree: root,
    currentNode: node,
    visitedNodes: [...path],
    traversalPath: [...path],
    status: `Processing node ${node.value}`
  });

  steps.push({
    ...initTreeState,
    tree: root,
    currentNode: node,
    visitedNodes: [...path],
    traversalPath: [...path],
    status: `Visiting left subtree of ${node.value}`
  });
  if (node.left) traverse(node.left);

  steps.push({
    ...initTreeState,
    tree: root,
    currentNode: node,
    visitedNodes: [...path],
    traversalPath: [...path],
    status: `Visiting right subtree of ${node.value}`
  });
  if (node.right) traverse(node.right);
});

// Postorder Traversal
export const postOrderTraversal = baseTraverse("Postorder", (node, steps, path, root, traverse) => {
  steps.push({
    ...initTreeState,
    tree: root,
    currentNode: node,
    visitedNodes: [...path],
    traversalPath: [...path],
    status: `Visiting left subtree of ${node.value}`
  });
  if (node.left) traverse(node.left);

  steps.push({
    ...initTreeState,
    tree: root,
    currentNode: node,
    visitedNodes: [...path],
    traversalPath: [...path],
    status: `Visiting right subtree of ${node.value}`
  });
  if (node.right) traverse(node.right);

  path.push(node.value);
  steps.push({
    ...initTreeState,
    tree: root,
    currentNode: node,
    visitedNodes: [...path],
    traversalPath: [...path],
    status: `Processing node ${node.value}`
  });
});