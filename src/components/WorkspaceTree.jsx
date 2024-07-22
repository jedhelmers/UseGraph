import React, { useState } from 'react';
import { ReactComponent as CaretDown } from '../assets/caret-down.svg';
import { ReactComponent as CaretRight } from '../assets/caret-right.svg';

const TreeNode = ({ node, errors, parentChain, isLocked, setCurrentNode, currentNode }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = node.children && node.children.length > 0;

    const toggleExpand = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const handleNodeSelect = (e) => {
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

        const regex = new RegExp(`.*-${currentNode?.id}$`, 'g');

        if (errors.findIndex(error => error.match(regex)) > -1) {
            output += " error";
        }

        return output;
    };

    return (
        <li>
            <div className={['row', selectionType()].join(' ')} id={node.id}>
                <button disabled={isLocked} onClick={toggleExpand} className='expand'>
                    {hasChildren ? (
                        isExpanded ?
                        <CaretDown style={{ width: 8, fill: 'rgba(255, 255, 255, .78)' }}/> :
                        <CaretRight style={{ width: 8, fill: 'rgba(255, 255, 255, .78)' }}/>
                    ) : ''}
                </button>
                <button disabled={isLocked} onClick={handleNodeSelect} className='navigate'>
                    {node.name ? node.name : 'ERROR'}
                </button>
            </div>
            {hasChildren && isExpanded && (
                <ul className='collapsible'>
                    {node.children.map(child => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            errors={errors}
                            parentChain={parentChain}
                            isLocked={isLocked}
                            setCurrentNode={setCurrentNode}
                            currentNode={currentNode}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

const Tree = ({ data, parentChain, errors, isLocked, setCurrentNode, currentNode }) => {
    return (
        <ul className='workspace-tree-ul'>
            {data.map(node => (
                <TreeNode
                    key={node.id}
                    node={node}
                    errors={errors}
                    parentChain={parentChain}
                    isLocked={isLocked}
                    setCurrentNode={setCurrentNode}
                    currentNode={currentNode}
                />
            ))}
        </ul>
    );
};

const WorkspaceTree = ({ currentNode, rootId = 0, isLocked = false, errors = [], data = [], setCurrentNode = console.log, parentChain = [] }) => {
    return (
        <div className='navigation-tree'>
            {data ? <Tree errors={errors} parentChain={parentChain} isLocked={isLocked} setCurrentNode={setCurrentNode} data={data} currentNode={currentNode} /> : <p>Loading tree...</p>}
        </div>
    );
};

export {
    WorkspaceTree, Tree, TreeNode
};
