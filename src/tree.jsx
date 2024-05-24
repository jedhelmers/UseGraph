import React, { useState } from 'react'


const TreeNode = ({ node, isLocked, setCurrentNode }) => {
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

    return (
        <li>
            <button disabled={isLocked} onClick={toggleExpand} style={{ cursor: 'pointer' }}>
                {hasChildren ? (isExpanded ? '[-] ' : '[+] ') : ''}
            </button>
            <button disabled={isLocked} onClick={handleNodeSelect} style={{ cursor: 'pointer' }}>
                {node.keyname}
            </button>
            {hasChildren && isExpanded && (
                <ul>
                    {node.children.map(child => (
                        <TreeNode key={child.id} isLocked={isLocked} node={child} setCurrentNode={setCurrentNode} />
                    ))}
                </ul>
            )}
        </li>
    );
};


const Tree = ({ data, isLocked, setCurrentNode }) => {
    return (
        <ul>
            <TreeNode isLocked={isLocked} setCurrentNode={setCurrentNode} node={data} />
        </ul>
    );
};

const MetadataTreeDisplay = ({ rootId=1, isLocked, reconstructNestedJSON, setCurrentNode }) => {
    const nestedData = reconstructNestedJSON(rootId);

    return (
        <div>
            {nestedData ? <Tree isLocked={isLocked} setCurrentNode={setCurrentNode} data={nestedData} /> : <p>Loading tree...</p>}
        </div>
    );
};


export {
    MetadataTreeDisplay, Tree, TreeNode
}