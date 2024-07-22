import React, { useState } from 'react';
import { ReactComponent as CaretDown } from '../assets/caret-down.svg';
import { ReactComponent as CaretRight } from '../assets/caret-right.svg';

/**
 * TreeNode component represents a single node in the tree structure.
 * It displays a node with expandable children and allows selection of the node.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.node - The node data to be displayed.
 * @param {Array} props.errors - List of error messages related to nodes.
 * @param {Array} props.parentChain - List of parent node IDs in the current selection chain.
 * @param {boolean} props.isLocked - Flag indicating if the node is locked.
 * @param {Function} props.setCurrentNode - Function to set the currently selected node.
 * @param {Object} props.currentNode - The currently selected node.
 *
 * @returns {JSX.Element} The rendered TreeNode component.
 */
const TreeNode = ({ node, errors, parentChain, isLocked, setCurrentNode, currentNode }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = node.children && node.children.length > 0;

    const toggleExpand = (e) => {
        // Prevents the click from affecting parent elements
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const handleNodeSelect = (e) => {
        // Prevents the click from affecting parent elements
        e.stopPropagation();
        setCurrentNode(node.id);
    };

    const selectionType = () => {
        let output = '';

        if (node?.id === currentNode?.id) {
            output = 'selected';
        }

        if (parentChain.includes(node?.id)) {
            output = 'parent-selected';
        }

        // Search list of errors for matching id
        const regex = new RegExp(`.*-${currentNode?.id}$`, 'g');

        if (errors.findIndex(error => error.match(regex)) > -1) {
            output += ' error';
        }

        return output;
    };

    return (
        <li>
            <div className={['row', selectionType()].join(' ')} id={node.id}>
                <button disabled={isLocked} onClick={toggleExpand} className='expand'>
                    {
                        hasChildren ? (
                            isExpanded ?
                            <CaretDown style={{ width: 8, fill: 'rgba(255, 255, 255, .78)' }} /> :
                            <CaretRight style={{ width: 8, fill: 'rgba(255, 255, 255, .78)' }} />
                        ) : ''
                    }
                </button>
                <button disabled={isLocked} onClick={handleNodeSelect} className='navigate'>
                    {node.keyname ? node.keyname : 'ERROR'}
                </button>
            </div>
            {hasChildren && isExpanded && (
                <ul className='navigation-tree-ul collapsible'>
                    {node.children.map(child => (
                        <TreeNode
                            errors={errors}
                            parentChain={parentChain}
                            key={child.id}
                            isLocked={isLocked}
                            node={child}
                            setCurrentNode={setCurrentNode}
                            currentNode={currentNode}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

/**
 * Tree component renders a tree structure starting from a root node.
 * It uses the TreeNode component to display each node and its children.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.data - The root node data for the tree.
 * @param {Array} props.parentChain - List of parent node IDs in the current selection chain.
 * @param {Array} props.errors - List of error messages related to nodes.
 * @param {boolean} props.isLocked - Flag indicating if the nodes are locked.
 * @param {Function} props.setCurrentNode - Function to set the currently selected node.
 * @param {Object} props.currentNode - The currently selected node.
 *
 * @returns {JSX.Element} The rendered Tree component.
 */
const Tree = ({ data, parentChain, errors, isLocked, setCurrentNode, currentNode }) => {
    return (
        <ul className='navigation-tree-ul'>
            <TreeNode
                errors={errors}
                parentChain={parentChain}
                isLocked={isLocked}
                setCurrentNode={setCurrentNode}
                node={data}
                currentNode={currentNode}
            />
        </ul>
    );
};

/**
 * MetadataTreeDisplay component manages the display of the metadata tree.
 * It reconstructs the tree data from a root ID and renders the Tree component.
 *
 * @param {Object} props - The properties object.
 * @param {number} [props.rootId=0] - The root ID for reconstructing the tree data.
 * @param {boolean} props.isLocked - Flag indicating if the nodes are locked.
 * @param {Array} props.errors - List of error messages related to nodes.
 * @param {Function} props.reconstructNestedJSON - Function to reconstruct the tree data from the root ID.
 * @param {Function} props.setCurrentNode - Function to set the currently selected node.
 * @param {Object} props.currentNode - The currently selected node.
 * @param {Array} props.parentChain - List of parent node IDs in the current selection chain.
 *
 * @returns {JSX.Element} The rendered MetadataTreeDisplay component with the tree structure.
 */
const MetadataTreeDisplay = ({ rootId = 0, isLocked, errors, reconstructNestedJSON, setCurrentNode, currentNode, parentChain }) => {
    const nestedData = reconstructNestedJSON(rootId);

    return (
        <div className='navigation-tree'>
            {nestedData ? (
                <Tree
                    errors={errors}
                    parentChain={parentChain}
                    isLocked={isLocked}
                    setCurrentNode={setCurrentNode}
                    data={nestedData}
                    currentNode={currentNode}
                />
            ) : (
                <p>Loading tree...</p>
            )}
        </div>
    );
};

export {
    MetadataTreeDisplay,
    Tree,
    TreeNode
};
