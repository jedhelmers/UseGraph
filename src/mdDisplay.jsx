import React, { useState, useEffect } from 'react';
import useGraph from './useGraph';
import MetadataForm from './mdForm';
import { MetadataTreeDisplay } from './tree';
import { ReactComponent as SquarePlus} from './assets/square-plus.svg';

const MetadataDisplay = ({ itemId = 1, setItemId }) => {
    const { updateNode, setCurrentNode, getNode, addNode, addChild, getParentIds, removeNode, getChildNodes, reconstructNestedJSON } = useGraph();
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

    // useEffect(() => {
    //     console.log(currentNode)
    //     if (currentNode?.id) {
    //         console.log('getParentIds', getParentIds(currentNode.id))
    //     }
    // }, [getParentIds])

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
    }

    // Load initial nodes - runs once
    useEffect(() => {
        // Assuming 1 means initial load
        if (itemId === 1) {
            let item1 = { id: 0, keyname: "key1", value: "", type: "", units: "", children: [], annotation: '' };
            addNode(item1);

            for (let i = 1; i < 100; i++) {
                const parentId = Math.floor(i * Math.random())
                let temp = { parentId: parentId, id: i, keyname: `key${i}`, value: '', type: "", units: "", children: [], annotation: '' };
                addNode(temp);
                addChild(parentId, i);
            }
        }
    }, []);

    useEffect(() => {
        console.log('errors', errors)
    }, [errors])

    useEffect(() => {
        setCurrentNodeState(getNode(itemId));
        setChildren(getChildNodes(itemId));
    }, [itemId, getNode, getChildNodes, currentNode]);


    const handleNodeSelect = (nodeId) => {
        if (nodeId !== undefined) {
            setItemId(nodeId)
        }

        setCurrentNode(nodeId);
        setCurrentNodeState(getNode(nodeId));
        setChildren(getChildNodes(nodeId));
    };

    // console.log("currentNode", itemId, currentNode)

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
                    {currentNode && (
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
