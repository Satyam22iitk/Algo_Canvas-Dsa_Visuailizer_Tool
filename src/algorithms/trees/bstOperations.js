import { initTreeState } from "../../utils/tree";

let intervalId = null;
let stopRequested = false;

function TreeNode(value) {
  this.value = value;
  this.left = null;
  this.right = null;
  this.id = Math.random().toString(36).substr(2, 9);
}

export const bstInsert = {
  name: "BST Insertion",
  visualize: (root, value, speed, updateState, onComplete) => {
    stopRequested = false;
    const steps = [];
    let newNode = null;

    const insert = (node, val) => {
      if (!node) {
        newNode = new TreeNode(val);
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: newNode,
          status: `Creating new node for ${val}`
        });
        return newNode;
      }

      steps.push({
        ...initTreeState,
        tree: root,
        currentNode: node,
        status: `Visiting node ${node.value}`
      });

      if (val < node.value) {
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: node,
          status: `${val} < ${node.value}, moving left`
        });
        node.left = insert(node.left, val);
      } else if (val > node.value) {
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: node,
          status: `${val} > ${node.value}, moving right`
        });
        node.right = insert(node.right, val);
      } else {
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: node,
          status: `${val} already exists in tree`
        });
      }
      return node;
    };

    const newRoot = insert(root, value) || root;

    steps.push({
      ...initTreeState,
      tree: newRoot,
      currentNode: newNode,
      status: `✅ Inserted ${value} into BST`,
      visitedNodes: [...steps[steps.length - 1]?.visitedNodes || []]
    });

    let stepIndex = 0;
    intervalId = setInterval(() => {
      if (stopRequested || stepIndex >= steps.length) {
        clearInterval(intervalId);
        if (onComplete) onComplete(stopRequested ? root : newRoot);
        return;
      }
      updateState(steps[stepIndex]);
      stepIndex++;
    }, 1500 / speed);
  },
  stop: () => {
    stopRequested = true;
    clearInterval(intervalId);
  }
};

export const bstSearch = {
  name: "BST Search",
    code: `// C++ implementation of BST Search
TreeNode* search(TreeNode* root, int value) {
  // Base Cases: root is null or value is present at root
  if (root == nullptr || root->val == value)
    return root;
  
  // Value is greater than root's value
  if (root->val < value) 
    return search(root->right, value);
  
  // Value is smaller than root's value
  return search(root->left, value);
}`,
  explanation: "Searches for a value in a Binary Search Tree by recursively comparing the target value with each node's value. If the target is less than the current node's value, the search continues in the left subtree; if greater, it continues in the right subtree. Returns the node if found, otherwise returns null.",
  complexity: {
    time: "O(h) where h is the height of the tree. O(log n) for balanced BST, O(n) for skewed tree.",
    space: "O(h) for recursive call stack. O(1) for iterative implementation."
  },
  visualize: (root, value, speed, updateState, onComplete) => {
    stopRequested = false;
    const steps = [];

    const search = (node) => {
      if (!node) {
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: null,
          status: `❌ ${value} not found in the tree`
        });
        return null;
      }

      steps.push({
        ...initTreeState,
        tree: root,
        currentNode: node,
        status: `Visiting node ${node.value}`
      });

      if (value === node.value) {
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: node,
          color: "green",
          status: `✅ Found ${value} in the tree`
        });
        return node;
      }

      if (value < node.value) {
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: node,
          status: `${value} < ${node.value}, moving left`
        });
        return search(node.left);
      } else {
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: node,
          status: `${value} > ${node.value}, moving right`
        });
        return search(node.right);
      }
    };

    search(root);

    let stepIndex = 0;
    intervalId = setInterval(() => {
      if (stopRequested || stepIndex >= steps.length) {
        clearInterval(intervalId);
        if (onComplete) onComplete(null);
        return;
      }
      updateState(steps[stepIndex]);
      stepIndex++;
    }, 1500 / speed);
  },
  stop: () => {
    stopRequested = true;
    clearInterval(intervalId);
  }
};

export const bstDelete = {
  name: "BST Deletion",
  visualize: (root, value, speed, updateState, onComplete) => {
    stopRequested = false;
    const steps = [];

    const findMin = (node) => {
      while (node.left) node = node.left;
      return node;
    };

    const deleteNode = (node, val) => {
      if (!node) {
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: null,
          status: `❌ ${val} not found in tree`
        });
        return null;
      }

      steps.push({
        ...initTreeState,
        tree: root,
        currentNode: node,
        status: `Visiting node ${node.value}`
      });

      if (val < node.value) {
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: node,
          status: `${val} < ${node.value}, moving left`
        });
        node.left = deleteNode(node.left, val);
      } else if (val > node.value) {
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: node,
          status: `${val} > ${node.value}, moving right`
        });
        node.right = deleteNode(node.right, val);
      } else {
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: node,
          status: `Found node ${val}, deleting...`
        });

        if (!node.left && !node.right) return null;
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        const successor = findMin(node.right);
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: successor,
          status: `Successor is ${successor.value}`
        });

        node.value = successor.value;
        node.right = deleteNode(node.right, successor.value);
      }

      return node;
    };

    const newRoot = deleteNode(root, value);

    steps.push({
      ...initTreeState,
      tree: newRoot,
      currentNode: null,
      status: `✅ Deleted ${value} from BST`
    });

    let stepIndex = 0;
    intervalId = setInterval(() => {
      if (stopRequested || stepIndex >= steps.length) {
        clearInterval(intervalId);
        if (onComplete) onComplete(stopRequested ? root : newRoot);
        return;
      }
      updateState(steps[stepIndex]);
      stepIndex++;
    }, 1500 / speed);
  },
  stop: () => {
    stopRequested = true;
    clearInterval(intervalId);
  }
};
