import React, { useState } from 'react'


const TreeNode = ({ node, setCurrentNode }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = node.children && node.children.length > 0;

    const toggleExpand = (e) => {
        e.stopPropagation(); // Prevents the click from affecting parent elements
        setIsExpanded(!isExpanded);
    };

    const handleNodeSelect = (e) => {
        e.stopPropagation(); // Prevents the click from affecting parent elements
        setCurrentNode(node.id);
    };

    return (
        <li>
            <span onClick={toggleExpand} style={{ cursor: 'pointer' }}>
                {hasChildren ? (isExpanded ? '[-] ' : '[+] ') : ''}
            </span>
            <span onClick={handleNodeSelect} style={{ cursor: 'pointer' }}>
                {node.keyname}
            </span>
            {hasChildren && isExpanded && (
                <ul>
                    {node.children.map(child => (
                        <TreeNode key={child.id} node={child} setCurrentNode={setCurrentNode} />
                    ))}
                </ul>
            )}
        </li>
    );
};


const Tree = ({ data, setCurrentNode }) => {
    return (
        <ul>
            <TreeNode setCurrentNode={setCurrentNode} node={data} />
        </ul>
    );
};

const MetadataTreeDisplay = ({ rootId=1, reconstructNestedJSON, setCurrentNode }) => {
    const nestedData = reconstructNestedJSON(rootId);

    return (
        <div>
            {nestedData ? <Tree setCurrentNode={setCurrentNode} data={nestedData} /> : <p>Loading tree...</p>}
        </div>
    );
};


export {
    MetadataTreeDisplay, Tree, TreeNode
}