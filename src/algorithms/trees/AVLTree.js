import { initTreeState } from "../../utils/tree";

function TreeNode(value) {
  this.value = value;
  this.left = null;
  this.right = null;
  this.height = 1;
  this.id = Math.random().toString(36).substr(2, 9);
}

function getHeight(node) {
  return node ? node.height : 0;
}

function getBalance(node) {
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

function rightRotate(y) {
  const x = y.left;
  const T2 = x.right;

  x.right = y;
  y.left = T2;

  y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
  x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));

  return x;
}

function leftRotate(x) {
  const y = x.right;
  const T2 = y.left;

  y.left = x;
  x.right = T2;

  x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
  y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));

  return y;
}

let stopRequested = false;

export function stop() {
  stopRequested = true;
}

export const avlInsert = {
  name: "AVL Insertion",
  visualize: (root, value, speed, updateState, onComplete) => {
    const steps = [];
    stopRequested = false;

    const insert = (node, val) => {
      if (stopRequested) return node;

      if (!node) {
        const newNode = new TreeNode(val);
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: newNode,
          status: `🌱 Creating new node for ${val}`
        });
        return newNode;
      }

      steps.push({
        ...initTreeState,
        tree: root,
        currentNode: node,
        status: `🔍 Visiting node ${node.value}`
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
          status: `⚠️ ${val} already exists in the tree`
        });
        return node;
      }

      node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
      const balance = getBalance(node);

      steps.push({
        ...initTreeState,
        tree: root,
        currentNode: node,
        status: `🔄 Updated height to ${node.height}, balance = ${balance}`
      });

      if (balance > 1 && val < node.left.value) {
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: node,
          status: `↪️ Left-Left case at ${node.value}, performing right rotation`
        });
        return rightRotate(node);
      }

      if (balance < -1 && val > node.right.value) {
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: node,
          status: `↩️ Right-Right case at ${node.value}, performing left rotation`
        });
        return leftRotate(node);
      }

      if (balance > 1 && val > node.left.value) {
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: node,
          status: `🔁 Left-Right case at ${node.value}, performing left-right rotation`
        });
        node.left = leftRotate(node.left);
        return rightRotate(node);
      }

      if (balance < -1 && val < node.right.value) {
        steps.push({
          ...initTreeState,
          tree: root,
          currentNode: node,
          status: `🔁 Right-Left case at ${node.value}, performing right-left rotation`
        });
        node.right = rightRotate(node.right);
        return leftRotate(node);
      }

      return node;
    };

    const newRoot = insert(root, value);

    steps.push({
      ...initTreeState,
      tree: newRoot,
      currentNode: null,
      status: `✅ Successfully inserted ${value} into AVL Tree`
    });

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stopRequested || stepIndex >= steps.length) {
        clearInterval(interval);
        if (onComplete) onComplete(stopRequested ? root : newRoot);
        return;
      }
      updateState(steps[stepIndex]);
      stepIndex++;
    }, 1500 / speed);
  }
};
