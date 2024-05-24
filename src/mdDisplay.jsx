import React, { useState, useEffect } from 'react';
import useGraph from './useGraph';
import MetadataForm from './mdForm';
import { MetadataTreeDisplay } from './tree';

const MetadataDisplay = ({ itemId = 1, setItemId }) => {
    const { updateNode, setCurrentNode, getNode, addNode, addChild, getChildNodes, reconstructNestedJSON } = useGraph();
    const [currentNode, setCurrentNodeState] = useState(null);
    const [children, setChildren] = useState([]);
    const [errors, setErrors] = useState([])

    const handleAddChild = (id) => {
        const newChildId = `child-${Math.random().toString(36).substr(2, 9)}`
        console.log('newChildId', newChildId)
        let newChildData = { id: newChildId, keyname: "Node", value: "value1", type: "type1", units: "units1", children: [] }

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
    }

    // Load initial nodes - runs once
    useEffect(() => {
        // Assuming 1 means initial load
        if (itemId === 1) {
            let item1 = { id: 0, keyname: "key1", value: "value1", type: "type1", units: "units1", children: [] };
            addNode(item1);

            for (let i = 1; i < 100; i++) {
                let temp = { id: i, keyname: `key${i}`, value: `value${i}`, type: "type2", units: "units2", children: [] };
                addNode(temp);
                addChild(Math.floor(i * Math.random()), i);
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
        console.log('nodeId', nodeId)
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
                        reconstructNestedJSON={reconstructNestedJSON}
                        setCurrentNode={handleNodeSelect}
                        isLocked={errors.length}
                    />
                </div>
                <div>
                    {currentNode && (
                        <MetadataForm
                            isRoot={true}
                            id={itemId}
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
                    <ul>
                        {currentNode?.children.map((id) => (
                            <li key={id}>
                                {/* {getNode(id).keyname}
                                <button onClick={() => handleNodeSelect(id)}>
                                    View This Child
                                </button> */}

                                <MetadataForm
                                    isRoot={false}
                                    id={id}
                                    isLocked={errors.length}
                                    addChild={handleAddChild}
                                    handleNodeSelect={handleNodeSelect}
                                    errorHandler={errorHandler}
                                    metadata={getNode(id)}
                                    updateNode={updateNode}
                                    reconstructNestedJSON={reconstructNestedJSON}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default MetadataDisplay;
