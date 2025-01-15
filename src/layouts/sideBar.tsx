/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import React from 'react';
import { usePages } from '@/hooks/usePages';
import { useRouter } from 'next/navigation';
import { Tree } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';

interface CustomTreeNode extends TreeNode {
  url?: string;
}

export default function SideBar({ session: initialSession }: SessionProp) {
  const router = useRouter();
  const { pagesPermission } = usePages(initialSession);

  const buildTreeData = (data: any[], level = 0) => {
    if (!Array.isArray(data)) {
      console.error('Invalid data: Expected an array, but got:', data);
      return [];
    }

    const map = new Map();
    const roots: any[] = [];

    data.forEach((item) => {
      map.set(item.code, {
        ...item,
        key: item.code,
        label: item.name,
        url: item.url,
        children: [],
        level,
        className: `level-${level}`,
      });
    });

    data.forEach((item) => {
      if (item.parentCode) {
        const parent = map.get(item.parentCode);
        if (parent) {
          const childNode = map.get(item.code);
          childNode.level = parent.level + 1;
          childNode.className = `level-${childNode.level}`;
          parent.children.push(childNode);
        }
      } else {
        roots.push(map.get(item.code));
      }
    });

    return roots;
  };

  const handleNodeClick = (node: CustomTreeNode) => {
    if (node.url) {
      router.push(node.url);
    } else {
      console.warn('Selected node does not have a URL:', node);
    }
  };

  const nodeTemplate = (node: CustomTreeNode, options: any) => {
    return (
      <div
        className={`node-label ${options.className}`}
        onClick={() => handleNodeClick(node)}
        style={{ cursor: node.url ? 'pointer' : 'default', color: node.url ? 'black' : 'inherit' }}
      >
        {node.label}
      </div>
    );
  };

  const treeData = buildTreeData(pagesPermission || []);

  return (
    <div className="tree-container">
      <Tree
        value={treeData}
        className="tree-container"
        nodeTemplate={nodeTemplate}
      />
    </div>
  );
}
