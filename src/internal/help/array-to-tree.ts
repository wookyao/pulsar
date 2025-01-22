
type TreeItem<T> = T & {
  children?: TreeItem<T>[];
};

// 将 扁平化的数组 转成 tree
export function arrayToTree<T extends { id: number; parentId: number | null }>(
  items: T[],
): TreeItem<T>[] {
  const itemMap = new Map<number, TreeItem<T>>();
  const result: TreeItem<T>[] = [];

  // First pass: create a map of all items
  items.forEach((item) => {
    const currentItem: TreeItem<T> = { ...item, children: [] };
    itemMap.set(item.id, currentItem);
  });

  // Second pass: build the tree structure
  itemMap.forEach((currentItem) => {
    const parentId = currentItem.parentId;

    if (!parentId) {
      result.push(currentItem);
    } else {
      const parentItem = itemMap.get(parentId);
      if (parentItem) {
        parentItem.children!.push(currentItem);
      }
    }
  });

  // Remove children from leaf nodes
  const removeEmptyChildren = (nodes: TreeItem<T>[]): TreeItem<T>[] => {
    return nodes.map((node) => {
      if (node.children && node.children.length > 0) {
        node.children = removeEmptyChildren(node.children);
      } else {
        delete node.children; // Remove the children field from leaf nodes
      }
      return node;
    });
  };

  return removeEmptyChildren(result);
}