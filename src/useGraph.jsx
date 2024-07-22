import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing a graph of nodes with various utilities for interacting with the graph.
 * 
 * @returns {Object} - The object containing functions and state for managing the graph.
 */
const useGraph = () => {
    const [nodes, setNodes] = useState(new Map());
    const [currentNodeId, setCurrentNodeId] = useState(null);
    const [currentChildren, setCurrentChildren] = useState([]);

    /**
     * Recursively builds and exports the tree structure starting from root nodes.
     * 
     * @returns {Array} - An array of root nodes with their children and metadata.
     */
    const exportNode = () => {
        const buildTree = (nodeId) => {
            const node = nodes.get(nodeId);

            if (!node) {
                return null;
            }

            const { keyname, units, value, link, annotation, type, ...rest } = node;

            return {
                keyName: keyname,
                units,
                link: {
                    value,
                    type,
                },
                annotation,
                children: node.children.map(buildTree)
            };
        };

        // Find root nodes (nodes without a parent)
        const rootNodes = [];

        for (const [id, node] of nodes) {
            if (node.parentId === null) {
                rootNodes.push(buildTree(id));
            }
        }

        return rootNodes;
    };

    /**
     * Adds a new node to the graph.
     * 
     * @param {Object} metadataItem - The metadata for the new node, including an `id`.
     */
    const addNode = useCallback((metadataItem) => {
        setNodes(prev => new Map(prev).set(metadataItem.id, { parentId: null, ...metadataItem, children: [] }));
    }, []);

    /**
     * Sets the currently selected node by its ID.
     * 
     * @param {string} id - The ID of the node to select.
     */
    const setCurrentNode = useCallback((id) => {
        setCurrentNodeId(id);
    }, []);

    /**
     * Retrieves the currently selected node.
     * 
     * @returns {Object} - The currently selected node.
     */
    const getCurrentNode = useCallback(() => {
        return getNode(currentNodeId);
    }, [currentNodeId, nodes]);

    /**
     * Retrieves a node by its ID.
     * 
     * @param {string} id - The ID of the node to retrieve.
     * @returns {Object} - The node corresponding to the given ID.
     */
    const getNode = useCallback((id) => {
        return nodes.get(id);
    }, [nodes]);

    /**
     * Updates an existing node with new data.
     * 
     * @param {string} id - The ID of the node to update.
     * @param {Object} updates - The updates to apply to the node.
     */
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

    /**
     * Adds a child node to a parent node.
     * 
     * @param {string} parentId - The ID of the parent node.
     * @param {string} childId - The ID of the child node.
     */
    const addChild = useCallback((parentId, childId) => {
        setNodes(prev => {
            const newNodes = new Map(prev);
            const parentNode = newNodes.get(parentId);
            const childNode = newNodes.get(childId);

            if (parentNode && childNode) {
                if (!parentNode.children.includes(childId)) {
                    parentNode.children.push(childId);
                    newNodes.set(childId, { ...childNode, parentId });
                }
            }
            return newNodes;
        });
    }, []);

    /**
     * Retrieves the IDs of all parent nodes up the chain for a given node.
     * 
     * @param {string} nodeId - The ID of the node to get parent IDs for.
     * @returns {Array} - An array of parent node IDs.
     */
    const getParentIds = useCallback((nodeId) => {
        const parentIds = [];
        let currentNode = nodes.get(nodeId);

        while (currentNode && currentNode.parentId !== null) {
            parentIds.push(currentNode.parentId);
            currentNode = nodes.get(currentNode.parentId);
        }

        return parentIds;
    }, [nodes]);

    /**
     * Retrieves the parent nodes for a given node based on parent IDs.
     * 
     * @param {string} nodeId - The ID of the node to get parent key names for.
     * @returns {Array} - An array of parent nodes.
     */
    const getParentKeyNames = useCallback((nodeId) => {
        const parentNodes = [];
        const parentsIds = getParentIds(nodeId);

        for (const parentId of parentsIds) {
            parentNodes.push(nodes.get(parentId));
        }

        return parentNodes;
    }, [nodes, getParentIds]);

    /**
     * Removes a node and its references from the graph.
     * 
     * @param {string} id - The ID of the node to remove.
     */
    const removeNode = useCallback((id) => {
        setNodes(prev => {
            const newNodes = new Map(prev);

            // Find the parent node and remove the reference to this node
            for (const [nodeId, node] of newNodes) {
                if (node.children && node.children.includes(id)) {
                    node.children = node.children.filter(childId => childId !== id);
                }
            }

            // Remove the node from the map
            newNodes.delete(id);

            return newNodes;
        });
    }, []);

    /**
     * Retrieves the child nodes of a given node.
     * 
     * @param {string} nodeId - The ID of the node to get child nodes for.
     * @returns {Array} - An array of child nodes.
     */
    const getChildNodes = useCallback((nodeId) => {
        const node = getNode(nodeId);

        if (!node) {
            return [];
        }

        return node.children.map(childId => getNode(childId)).filter(child => !!child);
    }, [getNode]);

    /**
     * Reconstructs the tree data starting from a root node.
     * 
     * @param {string} rootId - The ID of the root node to start reconstructing the tree from.
     * @returns {Object|null} - The reconstructed tree structure or null if the root node is not found.
     */
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

    return {
        addNode,
        getNode,
        updateNode,
        setCurrentNode,
        getCurrentNode,
        addChild,
        removeNode,
        getChildNodes,
        reconstructNestedJSON,
        getParentIds,
        getParentKeyNames,
        exportNode,
        currentChildren
    };
};

export default useGraph;
