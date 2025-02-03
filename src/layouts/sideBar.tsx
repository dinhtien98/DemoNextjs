/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { usePages } from '@/hooks/usePages';
import { useRouter, usePathname } from 'next/navigation';
import { Tree } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';

interface CustomTreeNode extends TreeNode {
  url?: string;
}

export default function SideBar({ session: initialSession }: SessionProp) {
  const router = useRouter();
  const pathname = usePathname();
  const { pagesPermission } = usePages(initialSession);

  const STORAGE_KEY_EXPANDED = 'tree_expandedKeys';

  const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>(
    () => JSON.parse(sessionStorage.getItem(STORAGE_KEY_EXPANDED) || '{}')
  );
  const [activeNodeKey, setActiveNodeKey] = useState<string | null>(null); 

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_EXPANDED, JSON.stringify(expandedKeys));
  }, [expandedKeys]);

  useEffect(() => {
    if (pagesPermission) {
      const activeNode = pagesPermission.find((item) => item.url === pathname); 
      if (activeNode) {
        setActiveNodeKey(String(activeNode.code));
      }
    }
  }, [pathname, pagesPermission]);

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
        key: String(item.code),
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
    setActiveNodeKey(node.key ? String(node.key) : null);

    if (node.url) {
      router.push(node.url);
    } else {
      console.warn('Selected node does not have a URL:', node);
    }
  };

  const handleToggle = (event: any) => {
    setExpandedKeys(event.value);
  };

  const nodeTemplate = (node: CustomTreeNode, options: any) => {
    const isActive = node.key === activeNodeKey;
    return (
      <div
        className={`node-label ${options.className} ${isActive ? 'active-node' : ''}`}
        onClick={() => handleNodeClick(node)}
        style={{
          cursor: node.url ? 'pointer' : 'default',
          color: isActive ? 'blue' : 'black', 
          fontWeight: isActive ? 'bold' : 'normal',
        }}
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
        expandedKeys={expandedKeys}
        onToggle={handleToggle}
      />
    </div>
  );
}
