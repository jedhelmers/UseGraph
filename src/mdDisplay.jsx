import React, { useState, useEffect } from 'react';
import useGraph from './useGraph'; // Adjust the path as necessary
import MetadataForm from './mdForm';
import { MetadataTreeDisplay } from './tree';

const MetadataDisplay = ({ itemId = 1, setItemId }) => {
    const { updateNode, setCurrentNode, getNode, addNode, addChild, getChildNodes, reconstructNestedJSON } = useGraph();
    const [currentNode, setCurrentNodeState] = useState(null);
    const [children, setChildren] = useState([]);

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

    // Update currentNode and children when the selected node changes
    // useEffect(() => {
    //     console.log('CHANGED', currentNode)
    //     setCurrentNodeState(getNode(itemId));
    //     setChildren(getChildNodes(itemId));
    // }, [itemId, getNode, getChildNodes, currentNode]);

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
        console.log(getChildNodes(nodeId))
    };

    return (
        <>
            <h1>Current Metadata Node</h1>

            <div class="metadata-container">
                <div class="tree">
                    <MetadataTreeDisplay reconstructNestedJSON={reconstructNestedJSON} setCurrentNode={handleNodeSelect}/>
                </div>
                <div>
                    {currentNode && (
                        <MetadataForm
                            metadata={currentNode}
                            updateNode={updateNode}
                            reconstructNestedJSON={reconstructNestedJSON}
                        />
                    )}

                    {/* {console.log(currentNode)} */}

                    <h2>Children</h2>
                    <ul>
                        {/* {children.map((childNode) => (
                            <li key={childNode.id}>
                                {childNode.keyname}
                                <button onClick={() => handleNodeSelect(childNode.id)}>
                                    View This Child
                                </button>
                            </li>
                        ))} */}
                        {currentNode?.children.map((id) => (
                            <li key={id}>
                                {getNode(id).keyname}
                                <button onClick={() => handleNodeSelect(id)}>
                                    View This Child
                                </button>

                                <MetadataForm
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
