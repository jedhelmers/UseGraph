import React, { useState, useEffect } from 'react';
import useGraph from './useGraph';
import MetadataForm from './mdForm';
import { MetadataTreeDisplay } from './tree';
import { ReactComponent as SquarePlus} from './assets/square-plus.svg';


const KEYNAMES = ['Stuff', 'Junk']
const UNITS = ['ft', 'inches', 'cm']


const uuidv4 = () => {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}


const metadataItem = (id, keyname, parentId) => ({
    id,
    keyname,
    parentId,
    value: "",
    type: "",
    units: "",
    children: [],
    annotation: ''
})


const MetadataDisplay = ({ itemId = 0, setItemId }) => {
    const {
        updateNode,
        setCurrentNode,
        exportNode,
        getNode,
        addNode,
        addChild,
        getParentIds,
        getParentKeyNames,
        removeNode,
        getChildNodes,
        reconstructNestedJSON
    } = useGraph();
    const [currentNode, setCurrentNodeState] = useState(null);
    const [_, setChildren] = useState([]);
    const [errors, setErrors] = useState([])

    const handleAddChild = (parentId) => {
        const _parentId = parentId === 'root' ? 0 : parentId
        const newChildId = uuidv4()
        let newChildData = metadataItem(newChildId, 'Node', _parentId)
        const newChildNode = { id: newChildId, ...newChildData, children: [] };
        addNode(newChildNode);
        addChild(_parentId, newChildId);
    };

    const errorHandler = (id, isValid) => {
        if (!isValid) {
            setErrors([
                ...errors,
                id
            ])
        } else {
            const new_errors = errors.filter(_id => _id !== id)
            setErrors(new_errors)
        }
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
        if (errors.length) {
            return
        }

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

            <div className='full-width'>
                <div className="metadata-container">
                    <div className="tree">
                        <MetadataTreeDisplay
                            currentNode={currentNode}
                            reconstructNestedJSON={reconstructNestedJSON}
                            setCurrentNode={handleNodeSelect}
                            isLocked={errors.length}
                            parentChain={getParentIds(currentNode?.id)}
                            errors={errors}
                        />
                    </div>
                    <div>
                        <div className='toolbar'>
                            <button onClick={() => {
                                console.log(exportNode()[0].children)
                            }}>
                                Export
                            </button>

                        </div>
                        <div className='bread-crumbs'>
                            {
                                getParentKeyNames(currentNode?.id).reverse().map((node, i) => {
                                    return (
                                        <span
                                            key={i}
                                            onClick={() => handleNodeSelect(node?.id)}
                                        >
                                            {
                                                ` ${node?.keyname} > `
                                            }
                                        </span>
                                    )
                                })
                            }
                            <span className='kaboose'>{currentNode?.keyname}</span>
                        </div>

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
                                keynames={KEYNAMES}
                                units={UNITS}
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
                                            keynames={KEYNAMES}
                                            units={UNITS}
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
            </div>
        </>
    );
};

export default MetadataDisplay;
