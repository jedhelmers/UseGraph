import React, { useState, useEffect, useRef } from 'react';
import ComboBox from './ComboBox.jsx';
import LinkBox from './LinkBox.jsx';
import { ReactComponent as TrashCan } from '../assets/trash-can.svg';
import { ReactComponent as Link } from '../assets/link.svg';
import { ReactComponent as DownAlt } from '../assets/level-down-alt.svg';
import { ReactComponent as SquarePlus } from '../assets/square-plus.svg';
import { ReactComponent as SquarePlusFill } from '../assets/square-plus-fill.svg';

// TODO: Handle this better
const TYPES = [
    '--------',
    'Automatic',
    'Boolean',
    'Float',
    'Integer',
    'Link',
    'String'
];

/**
 * Validates the value based on the type.
 * @param {object} valueRef - Ref to the value input element.
 * @param {object} typeRef - Ref to the type select element.
 * @return {boolean} True if the value is valid for the given type, otherwise false.
 */
const validateValue = (valueRef, typeRef) => {
    const value = valueRef.current.children[1].value;
    const type = typeRef.current.children[1].value;

    switch (type) {
        case "Integer":
            return Number.isInteger(+value);
        case "Float":
            // TODO: 0.0 evaluates to false. Fix it.
            return !!Number.parseFloat(+value);
        case "Boolean":
            return ['TRUE', 'FALSE'].includes(value.toUpperCase());
        default:
            return true;
    }
};

/**
 * MetadataForm component allows for editing metadata attributes and managing their state.
 *
 * Provides functionality to validate inputs, handle changes, and interact with the parent component
 * for adding children, removing nodes, and updating metadata.
 *
 * @param {object} props - Component props.
 * @param {object} props.metadata - Metadata object to be displayed and edited.
 * @param {function} props.updateNode - Function to update a node's data.
 * @param {function} props.addChild - Function to add a child node.
 * @param {function} props.removeNode - Function to remove a node.
 * @param {Array} props.keynames - List of keynames to choose from.
 * @param {Array} props.units - List of units to choose from.
 * @param {function} props.handleNodeSelect - Function to handle node selection.
 * @param {boolean} props.isLocked - Flag indicating if the form is locked.
 * @param {string|number} props.id - ID of the current metadata item.
 * @param {string|number} props.parentId - ID of the parent metadata item.
 * @param {boolean} props.isRoot - Flag indicating if the item is a root item.
 * @param {boolean} props.checked - Checkbox checked state for deletion.
 * @param {function} props.errorHandler - Function to handle validation errors.
 * @return {React.Component} The MetadataForm component.
 */
const MetadataForm = ({
    metadata,
    updateNode,
    addChild,
    removeNode,
    keynames,
    units,
    handleNodeSelect,
    isLocked,
    id,
    parentId,
    isRoot,
    checked,
    errorHandler
}) => {
    const [showTrash, setShowTrash] = useState(checked);
    const [showLinkBox, setShowLinkBox] = useState(false);
    const cardRef = useRef(null);
    const keynameRef = useRef(null);
    const valueRef = useRef(null);
    const typeRef = useRef(null);

    useEffect(() => {
        setShowTrash(checked);
    }, [checked]);

    useEffect(() => {
        const card = cardRef.current;
        if (isRoot) {
            card.classList.remove('child-card');
            card.classList.add('parent-card');
        } else {
            card.classList.add('child-card');
            card.classList.remove('parent-card');
        }
    }, [isRoot]);

    /**
     * Validates the input fields and updates the error state.
     * @param {object} e - The event object containing the input field's name and value.
     */
    const isValueValid = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case 'keyname':
                const isKeyNameValid = !!value.length;
                validationHandler(name, keynameRef, isKeyNameValid, 1);
                break;
            case 'value':
            case 'type':
                const isValueFieldValid = validateValue(valueRef, typeRef);
                validationHandler('value', valueRef, isValueFieldValid, 2);
                validationHandler('type', typeRef, isValueFieldValid, null);
                break;
            default:
                break;
        }
    };

    /**
     * Handles the validation and displays error messages if the input is invalid.
     * @param {string} name - Name of the input field.
     * @param {object} ref - Ref to the input field's container.
     * @param {boolean} isValid - Indicates if the input is valid.
     * @param {number|null} refIndex - Index of the error message element, if applicable.
     */
    const validationHandler = (name, ref, isValid, refIndex) => {
        const _name = `${name}-${id}`;
        errorHandler(_name, isValid);

        if (refIndex) {
            const label = ref?.current?.children[0];
            const errorMessage = ref?.current?.children[refIndex];

            try {
                if (isValid) {
                    label.classList.remove('error-text');
                    errorMessage.classList.add('hidden');
                } else {
                    label.classList.add('error-text');
                    errorMessage.classList.remove('hidden');
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    /**
     * Handles input changes and updates the metadata node.
     * @param {object} e - The event object containing the input field's name and value.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        isValueValid(e);

        const updatedNode = { ...metadata, [name]: value };
        updateNode(metadata.id, updatedNode);
    };

    return (
        <div ref={cardRef} className='metadata-item card card-body card-ht metadata-card child-card mb-3'>
            <div className='card-item'>
                {/* Left */}
                <div className='space-between reverse-v'>
                    {!isRoot && (
                        <SquarePlus
                            style={{ width: 20, cursor: 'pointer', fill: 'white' }}
                            disabled={isLocked}
                            onClick={() => addChild(parentId)}
                        />
                    )}
                </div>

                {/* Middle */}
                <div>
                    <div className='full-width space-between'>
                        <div className='full-width space-between center'>
                            {isRoot && (
                                <div>
                                    <div></div>
                                    <SquarePlusFill
                                        style={{ width: 20, cursor: 'pointer' }}
                                        disabled={isLocked}
                                        onClick={() => addChild(parentId)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className='flex-end'>
                            {showTrash ? (
                                <TrashCan
                                    style={{ paddingRight: 20, width: 16, cursor: 'pointer', fill: isRoot ? 'inherit' : 'white' }}
                                    disabled={isLocked}
                                    onClick={() => {
                                        handleNodeSelect(parentId);
                                        removeNode(id);
                                    }}
                                />
                            ) : (
                                <div style={{ paddingRight: 20, width: 16 }}></div>
                            )}
                            {!isRoot && (
                                <>
                                    <DownAlt
                                        style={{ paddingRight: 20, width: 10, cursor: 'pointer' }}
                                        disabled={isLocked}
                                        onClick={() => handleNodeSelect(id)}
                                    />
                                </>
                            )}
                        </div>
                        <div></div>
                    </div>

                    <div className='form-group col' ref={keynameRef}>
                        <ComboBox
                            value={metadata.keyname}
                            name='keyname'
                            label='Keyname'
                            options={keynames}
                            callback={handleChange}
                        />
                        <div className='metadata-row-value-key-error form-group col alert-danger rounded p-3 hidden'>
                            Empty keys are not allowed.
                        </div>
                    </div>
                    <div className='form-group col' ref={valueRef}>
                        <label>Value:</label>
                        <input
                            className='form-control form-control-ht'
                            type='text'
                            name='value'
                            value={metadata.value}
                            onChange={handleChange}
                        />
                        <div className='metadata-row-value-key-error form-group col alert-danger rounded p-3 hidden'>
                            Type validation error
                        </div>
                    </div>
                    {showLinkBox && (
                        <LinkBox
                            value={metadata.value}
                            hideLinkBox={() => setShowLinkBox(false)}
                            handleChange={handleChange}
                        />
                    )}
                    <div className='form-group col' ref={typeRef}>
                        <label>Type:</label>
                        <select
                            className='form-control form-control-ht'
                            name='type'
                            value={metadata.type}
                            onChange={handleChange}
                        >
                            {TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='form-group col'>
                        <ComboBox
                            value={metadata.units}
                            name='units'
                            label='Units'
                            options={units}
                            callback={handleChange}
                        />
                    </div>
                    <div className='form-group col'>
                        <label>Annotation:</label>
                        <input
                            className='form-control form-control-ht'
                            type='text'
                            name='annotation'
                            value={metadata.annotation}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Right */}
                <div>
                    <div className='space-between vertical full-height'>
                        <div>
                            <input
                                className="trash-checkbox"
                                type='checkbox'
                                id={id}
                                checked={showTrash}
                                disabled={isLocked}
                                onChange={(e) => setShowTrash(e.target.checked)}
                            />
                        </div>
                        <Link
                            style={{ width: 20, cursor: 'pointer', fill: isRoot ? 'inherit' : 'white' }}
                            disabled={isLocked}
                            onClick={() => setShowLinkBox(!showLinkBox)}
                        />
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetadataForm;
