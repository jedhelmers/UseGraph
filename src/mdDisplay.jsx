import React, { useState, useEffect } from 'react';
import useGraph from './useGraph';
import MetadataForm from './mdForm';
import { MetadataTreeDisplay } from './tree';
import { ReactComponent as SquarePlus} from './assets/square-plus.svg';


const metadataItem = (id, keyname, parentId) => (
    { id, keyname, parentId, value: "", type: "", units: "", children: [], annotation: '' }
)


const MetadataDisplay = ({ itemId = 0, setItemId }) => {
    const { updateNode, setCurrentNode, exportNode, getNode, addNode, addChild, getParentIds, removeNode, getChildNodes, reconstructNestedJSON } = useGraph();
    const [currentNode, setCurrentNodeState] = useState(null);
    const [children, setChildren] = useState([]);
    const [errors, setErrors] = useState([])

    const handleAddChild = (id) => {
        const newChildId = `child-${Math.random().toString(36).substr(2, 9)}`
        let newChildData = { parentId: id, id: newChildId, keyname: "Node", value: "", type: "", units: "", children: [], annotation: '' }

        const newChildNode = { id: newChildId, ...newChildData, children: [] };
        addNode(newChildNode);
        addChild(id, newChildId);
    };

    const errorHandler = (id, isValid) => {
        if (!isValid) {
            setErrors([
                ...errors,
                id
            ])
        } else {
            setErrors(
                errors.filter(_id => _id !== id)
            )
        }

        console.log(exportNode())
    }

    // Load initial nodes - runs once
    useEffect(() => {
        if (itemId === 'root') {
            let item1 = metadataItem(0, 'root', null);
            addNode(item1);
            addChild(null, 1);

            for (let i = 1; i < 100; i++) {
                const parentId = Math.floor(i * Math.random())
                let temp = metadataItem(i, `key${i}`, parentId)
                addNode(temp);
                addChild(parentId, i);
            }
        }
    }, []);

    useEffect(() => {
        console.log('errors', errors)
    }, [errors])

    useEffect(() => {
        const _itemId = itemId === 'root' ? 0 : itemId
        setCurrentNodeState(getNode(_itemId));
        setChildren(getChildNodes(_itemId));
    }, [itemId, getNode, getChildNodes, currentNode]);

    const handleNodeSelect = (nodeId) => {
        if (nodeId !== undefined) {
            setItemId(nodeId)
        }

        setCurrentNode(nodeId);
        setCurrentNodeState(getNode(nodeId));
        setChildren(getChildNodes(nodeId));
    };

    return (
        <>
            <h1>Current Metadata Node</h1>

            <div className="metadata-container">
                <div className="tree">
                    <MetadataTreeDisplay
                        currentNode={currentNode}
                        reconstructNestedJSON={reconstructNestedJSON}
                        setCurrentNode={handleNodeSelect}
                        isLocked={errors.length}
                        parentChain={getParentIds(currentNode?.id)}
                    />
                </div>
                <div>
                    {currentNode && currentNode.parentId !== null && (
                        <MetadataForm
                            isRoot={true}
                            id={itemId}
                            parentId={currentNode.parentId}
                            removeNode={removeNode}
                            isLocked={errors.length}
                            addChild={handleAddChild}
                            handleNodeSelect={handleNodeSelect}
                            errorHandler={errorHandler}
                            metadata={currentNode}
                            updateNode={updateNode}
                            reconstructNestedJSON={reconstructNestedJSON}
                        />
                    )}
                    <h2>Children</h2>
                    <span>
                        {
                            currentNode?.children?.length ? currentNode?.children.map((id) => (
                                <span key={id}>
                                    <MetadataForm
                                        isRoot={false}
                                        id={id}
                                        parentId={itemId}
                                        removeNode={removeNode}
                                        isLocked={errors.length}
                                        addChild={handleAddChild}
                                        handleNodeSelect={handleNodeSelect}
                                        errorHandler={errorHandler}
                                        metadata={getNode(id)}
                                        updateNode={updateNode}
                                        reconstructNestedJSON={reconstructNestedJSON}
                                    />
                                </span>
                            )) : (
                                <SquarePlus
                                    style={{ width: 20, cursor: "pointer", fill: 'white' }}
                                    disabled={errors.length}
                                    onClick={() => handleAddChild(itemId)}
                                />
                            )
                        }
                    </span>
                </div>
            </div>
        </>
    );
};

export default MetadataDisplay;
