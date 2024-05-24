import React, { useEffect } from 'react';
import useGraph from './useGraph'; // Assuming the hook is in useGraph.js

const MetadataComponent = () => {
    const { addNode, addChild, reconstructNestedJSON, getChildNodes, getNode } = useGraph();

    // console.log('getNode', getNode())

    useEffect(() => {
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
