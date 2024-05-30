import React, { useState } from 'react'
import { ReactComponent as CaretDown} from './assets/caret-down.svg';
import { ReactComponent as CaretRight} from './assets/caret-right.svg';


const TreeNode = ({ node, errors, parentChain, isLocked, setCurrentNode, currentNode }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = node.children && node.children.length > 0;
    // console.log('parentChain', parentChain)
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
        let output = ''

        if (node?.id === currentNode?.id) {
            output = 'selected'
        }

        if (parentChain.includes(node?.id)) {
            output = 'parent-selected'
        }

        // Search list of errors for matching id.
        const regex = new RegExp(`.*-${currentNode?.id}$`, 'g')

        if (errors.findIndex(error => error.match(regex)) > -1) {
            output += " error"
        }

        return output
    }

    return (
        <li>
            <div className={['row', selectionType()].join(' ')} id={node.id}>
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
                    {node.keyname ? node.keyname : 'ERROR'}
                </button>
            </div>
            {hasChildren && isExpanded && (
                <ul className='collapsible'>
                    {node.children.map(child => (
                        <TreeNode errors={errors} parentChain={parentChain} key={child.id} isLocked={isLocked} node={child} setCurrentNode={setCurrentNode} currentNode={currentNode} />
                    ))}
                </ul>
            )}
        </li>
    );
};


const Tree = ({ data, parentChain, errors, isLocked, setCurrentNode, currentNode }) => {
    return (
        <ul>
            <TreeNode errors={errors} parentChain={parentChain} isLocked={isLocked} setCurrentNode={setCurrentNode} node={data} currentNode={currentNode} />
        </ul>
    );
};

const MetadataTreeDisplay = ({ rootId=0, isLocked, errors, reconstructNestedJSON, setCurrentNode, currentNode, parentChain }) => {
    const nestedData = reconstructNestedJSON(rootId);

    return (
        <div className='navigation-tree'>
            {nestedData ? <Tree errors={errors} parentChain={parentChain} isLocked={isLocked} setCurrentNode={setCurrentNode} data={nestedData} currentNode={currentNode}/> : <p>Loading tree...</p>}
        </div>
    );
};


export {
    MetadataTreeDisplay, Tree, TreeNode
}