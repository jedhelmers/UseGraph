import React, { useState } from 'react'
import { ReactComponent as CaretDown} from './assets/caret-down.svg';
import { ReactComponent as CaretRight} from './assets/caret-right.svg';


const TreeNode = ({ node, isLocked, setCurrentNode, currentNode }) => {
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
            <div className={['row', node?.id === currentNode?.id ? 'selected' : ''].join(' ')} id={node.id}>
                <button disabled={isLocked} onClick={toggleExpand} className='expand'>
                    {
                        hasChildren ? (
                            isExpanded ?
                            <CaretDown style={{ width: 8, fill: 'rgba(255, 255, 255, .78)' }}/> :
                            <CaretRight style={{ width: 8, fill: 'rgba(255, 255, 255, .78)' }}/>
                        ) : ''
                    }
                </button>
                <button disabled={isLocked} onClick={handleNodeSelect} className='navigate'>
                    {node.keyname}
                </button>
            </div>
            {hasChildren && isExpanded && (
                <ul className='collapsible'>
                    {node.children.map(child => (
                        <TreeNode key={child.id} isLocked={isLocked} node={child} setCurrentNode={setCurrentNode} currentNode={currentNode} />
                    ))}
                </ul>
            )}
        </li>
    );
};


const Tree = ({ data, isLocked, setCurrentNode, currentNode }) => {
    return (
        <ul>
            <TreeNode isLocked={isLocked} setCurrentNode={setCurrentNode} node={data} currentNode={currentNode} />
        </ul>
    );
};

const MetadataTreeDisplay = ({ rootId=1, isLocked, reconstructNestedJSON, setCurrentNode, currentNode }) => {
    const nestedData = reconstructNestedJSON(rootId);

    return (
        <div className='navigation-tree'>
            {nestedData ? <Tree isLocked={isLocked} setCurrentNode={setCurrentNode} data={nestedData} currentNode={currentNode}/> : <p>Loading tree...</p>}
        </div>
    );
};


export {
    MetadataTreeDisplay, Tree, TreeNode
}