import React, { useEffect } from 'react';
import useGraph from './useGraph'; // Assuming the hook is in useGraph.js

/**
 * MetadataComponent manages and displays a graph of nodes.
 * 
 * Utilizes the `useGraph` hook to manage nodes in the graph. On component mount, it adds
 * a set of nodes and establishes relationships between them.
 * 
 * @return {React.Component} The MetadataComponent rendering a graph in JSON format.
 */
const MetadataComponent = () => {
    const { addNode, addChild, reconstructNestedJSON, getChildNodes, getNode } = useGraph();

    useEffect(() => {
        // Adds initial node and 99 additional nodes with random relationships
        let item1 = { id: 0, keyname: "key1", value: "value1", type: "type1", units: "units1", children: [] };
        addNode(item1);

        for (let i = 1; i < 100; i++) {
            let temp = { id: i, keyname: `key${i}`, value: `value${i}`, type: "type2", units: "units2", children: [] };
            addNode(temp);
            addChild(Math.floor(i * Math.random()), i);
        }
    }, [addNode, addChild]);

    // Example to get the reconstructed JSON
    const nestedJSON = getChildNodes(1);

    return (
        <div>
            {/* Render your component based on the graph */}
            <pre>{JSON.stringify(nestedJSON, null, 3)}</pre>
        </div>
    );
};

export default MetadataComponent;
