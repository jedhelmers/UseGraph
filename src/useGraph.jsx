import { useState, useCallback, useEffect } from 'react';

const useGraph = () => {
    const [nodes, setNodes] = useState(new Map());
    const [currentNodeId, setCurrentNodeId] = useState(null);
    const [currentChildren, setCurrentChildren] = useState([]);

    const addNode = useCallback((metadataItem) => {
        setNodes(prev => new Map(prev).set(metadataItem.id, metadataItem));
    }, []);

    const setCurrentNode = useCallback((id) => {
        setCurrentNodeId(id);
    }, []);

    const getCurrentNode = useCallback(() => {
        return getNode(currentNodeId);
    }, [currentNodeId, nodes]);

    const getNode = useCallback((id) => {
        return nodes.get(id);
    }, [nodes]);

    const updateNode = useCallback((id, updates) => {
        setNodes(prev => {
            const newNodes = new Map(prev);
            const existingNode = newNodes.get(id);

            if (existingNode) {
                const updatedNode = { ...existingNode, ...updates };
                newNodes.set(id, updatedNode);
            }

            return newNodes;
        });
    }, []);

    const addChild = useCallback((parentId, childId) => {
        setNodes(prev => {
            const newNodes = new Map(prev);
            const parentNode = newNodes.get(parentId);
            if (parentNode && !parentNode.children.includes(childId)) {
                parentNode.children.push(childId);
            }
            return newNodes;
        });
        console.log('parentId, childId', parentId, childId)

    }, []);

    const getChildNodes = useCallback((nodeId) => {
        const node = getNode(nodeId);

        if (!node) {
            return [];
        }

        return node.children.map(childId => getNode(childId)).filter(child => !!child);
    }, [nodes]);

    const reconstructNestedJSON = useCallback((rootId) => {
        const rootNode = nodes.get(rootId);
        if (!rootNode) {
            return null;
        }

        const buildTree = (node) => {
            if (node?.children.length === 0) {
                return { ...node };
            }

            return {
                ...node,
                children: node.children.map(childId => buildTree(nodes.get(childId)))
            };
        };

        return buildTree(rootNode);
    }, [nodes]);

    useEffect(() => {
        if (currentNodeId !== null) {
            const children = getChildNodes(currentNodeId);
            setCurrentChildren(children);
        }
    }, [currentNodeId, nodes, getChildNodes]);

    return { addNode, getNode, updateNode, setCurrentNode, getCurrentNode, addChild, getChildNodes, reconstructNestedJSON, currentChildren };
};

export default useGraph;
