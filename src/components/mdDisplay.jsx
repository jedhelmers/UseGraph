import React, { useState, useEffect, useRef } from 'react';
import useGraph from '../useGraph';
import MetadataForm from './mdForm';
import { ReactComponent as TrashCan } from '../assets/trash-can.svg';
import { MetadataTreeDisplay } from './tree';
import { ReactComponent as SquarePlus } from '../assets/square-plus.svg';

// TODO: Keynames
const KEYNAMES = ['Stuff', 'Junk']
// TODO: Units
const UNITS = ['ft', 'inches', 'cm']

// TODO: Maybe handle node ids better?
/**
 * Generates a UUID v4.
 * @return {string} A UUID v4 string.
 */
const uuidv4 = () => {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

/**
 * Creates a metadata item object.
 * @param {number} id - The unique identifier for the item.
 * @param {string} keyname - The key name for the item.
 * @param {number} parentId - The parent ID of the item.
 * @return {object} Metadata item object.
 */
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

/**
 * MetadataDisplay component displays and manages metadata nodes and their relationships.
 * 
 * Utilizes the `useGraph` hook to handle nodes, their addition, and their removal. It manages 
 * state for the current node, errors, and children, and provides functionality for adding and 
 * removing nodes, and handling errors.
 * 
 * @param {object} props - Component props.
 * @param {number|string} props.itemId - ID of the current item to display.
 * @param {function} props.setItemId - Function to set the ID of the current item.
 * @return {React.Component} The MetadataDisplay component.
 */
const MetadataDisplay = ({ itemId = 0, setItemId }) => {
    const nodesRef = useRef(null);
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
    const [errors, setErrors] = useState([]);
    const [deleteChecked, setDeleteChecked] = useState(false);

    /**
     * Handles adding a child node to the given parent ID.
     * @param {number|string} parentId - The ID of the parent node.
     */
    const handleAddChild = (parentId) => {
        const _parentId = parentId === 'root' ? 0 : parentId;
        const newChildId = uuidv4();
        let newChildData = metadataItem(newChildId, 'Node', _parentId);
        const newChildNode = { id: newChildId, ...newChildData, children: [] };
        addNode(newChildNode);
        addChild(_parentId, newChildId);
    };

    /**
     * Updates error state based on the validity of the given ID.
     * @param {number|string} id - The ID of the node.
     * @param {boolean} isValid - Indicates if the node is valid.
     */
    const errorHandler = (id, isValid) => {
        if (!isValid) {
            setErrors([...errors, id]);
        } else {
            const new_errors = errors.filter(_id => _id !== id);
            setErrors(new_errors);
        }
    };

    // Load initial nodes - runs once
    useEffect(() => {
        if (itemId === 'root') {
            let item1 = metadataItem(0, 'root', null);
            addNode(item1);
            addChild(null, 1);

            for (let i = 1; i < 100; i++) {
                const parentId = Math.floor(i * Math.random());
                let temp = metadataItem(i, `key${i}`, parentId);
                addNode(temp);
                addChild(parentId, i);
            }
        }
    }, [itemId, addNode, addChild]);

    useEffect(() => {
        console.log(nodesRef);
    }, [nodesRef]);

    useEffect(() => {
        console.log('errors', errors);
    }, [errors]);

    useEffect(() => {
        setDeleteChecked(false);
    }, [currentNode]);

    useEffect(() => {
        const _itemId = itemId === 'root' ? 0 : itemId;
        setCurrentNodeState(getNode(_itemId));
        setChildren(getChildNodes(_itemId));
    }, [itemId, getNode, getChildNodes, currentNode]);

    /**
     * Handles the selection of a node and updates the state accordingly.
     * @param {number|string} nodeId - The ID of the node to select.
     */
    const handleNodeSelect = (nodeId) => {
        if (errors.length) {
            return;
        }

        if (nodeId !== undefined) {
            setItemId(nodeId);
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
                                console.log(exportNode()[0].children);
                            }}>
                                Export
                            </button>
                            <input
                                type='checkbox'
                                checked={deleteChecked}
                                onChange={(e) => setDeleteChecked(e.target.checked)}
                            />
                            {
                                deleteChecked && (
                                    <TrashCan
                                        style={{ width: 16, cursor: 'pointer', fill: 'white' }}
                                        onClick={() => {
                                            for (const checkboxSpan of nodesRef.current.children) {
                                                const collection = checkboxSpan.getElementsByClassName('trash-checkbox');

                                                for (const checkbox of collection) {
                                                    if (checkbox?.checked) {
                                                        removeNode(`${checkbox.id}`);
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                )
                            }
                        </div>
                        <div className='bread-crumbs'>
                            {
                                getParentKeyNames(currentNode?.id).reverse().map((node, i) => (
                                    <span
                                        key={i}
                                        onClick={() => handleNodeSelect(node?.id)}
                                    >
                                        {` ${node?.keyname} > `}
                                    </span>
                                ))
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
                                checked={deleteChecked}
                                reconstructNestedJSON={reconstructNestedJSON}
                            />
                        )}
                        <h2>Children</h2>
                        <span ref={nodesRef}>
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
                                            checked={deleteChecked}
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
