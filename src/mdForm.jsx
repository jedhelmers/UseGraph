import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as TrashCan} from './assets/trash-can.svg';
import { ReactComponent as DownAlt} from './assets/level-down-alt.svg';
import { ReactComponent as SquarePlus} from './assets/square-plus.svg';
import { ReactComponent as SquarePlusFill} from './assets/square-plus-fill.svg';


const TYPES = [
    '--------',
    'Automatic',
    'Boolean',
    'Float',
    'Integer',
    'Link',
    'String'
]


const MetadataForm = ({
    metadata,
    updateNode,
    addChild,
    removeNode,
    handleNodeSelect,
    isLocked,
    id,
    parentId,
    isRoot,
    errorHandler
}) => {
    const [formData, setFormData] = useState({ ...metadata });
    const cardRef = useRef(null)
    const keynameRef = useRef(null)

    useEffect(() => {
        const card = cardRef.current

        if (isRoot) {
            card.classList.remove('child-card')
            card.classList.add('parent-card')
        } else {
            card.classList.add('child-card')
            card.classList.remove('parent-card')
        }
    })

    useEffect(() => {
        setFormData({ ...metadata });
    }, [metadata]);

    const isValueValid = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case 'keyname':
                const isValid = !!value?.length
                validationHandler(keynameRef, isValid)
        }
    }

    const validationHandler = (ref, isValid) => {
        const label = ref.current.children[0]
        const errorMessage = ref.current.children[2]

        if (isValid) {
            label.classList.remove('error-text')
            errorMessage.classList.add('hidden')
        } else {
            label.classList.add('error-text')
            errorMessage.classList.remove('hidden')
        }

        errorHandler(id, isValid)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        isValueValid(e)

        const updatedNode = { ...metadata, [name]: value };
        updateNode(metadata.id, updatedNode);
    };

    return (
        <div ref={cardRef} className='metadata-item card card-body card-ht metadata-card child-card mb-3'>
            <div className='space-between'>
                {
                    !isRoot &&
                    <>
                        <DownAlt
                            style={{ width: 10, cursor: "pointer" }}
                            disabled={isLocked}
                            onClick={() => handleNodeSelect(id)}
                        />
                    </>
                }
                {
                    isRoot &&
                        <div className='row space-between full-width'>
                            <div></div>
                            <SquarePlusFill
                                style={{ width: 20, cursor: "pointer" }}
                                disabled={isLocked}
                                onClick={() => addChild(parentId)}
                            />
                        </div>
                }
                <TrashCan
                    style={{ width: 16, cursor: "pointer", fill: isRoot ? 'inherit' : 'white' }}
                    disabled={isLocked} onClick={() => {
                        handleNodeSelect(parentId)
                        removeNode(id)
                    }}
                />
            </div>
            <div className='form-group col' ref={keynameRef}>
                <label htmlFor='metadata-row-key' className='font-weight-bold'>Keyname:</label>
                <input
                    className='form-control form-control-ht'
                    type="text"
                    name="keyname"
                    id="metadata-row-key"
                    value={metadata.keyname}
                    onChange={handleChange}
                />
                <div className='metadata-row-value-key-error form-group col alert-danger rounded p-3 hidden'>
                    Empty keys are not allowed.
                </div>
            </div>
            <div className='form-group col'>
                <label>Value:</label>
                <input
                    className='form-control form-control-ht'
                    type="text"
                    name="value"
                    value={metadata.value}
                    onChange={handleChange}
                />
            </div>
            <div className='form-group col'>
                <label>Type:</label>
                <select
                    className='form-control form-control-ht'
                    name="type"
                    value={metadata.type}
                    onChange={handleChange}
                >
                    {TYPES.map(type => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
            <div className='form-group col'>
                <label>Units:</label>
                <input
                    className='form-control form-control-ht'
                    type="text"
                    name="units"
                    value={metadata.units}
                    onChange={handleChange}
                />
            </div>
            <div className='form-group col'>
                <label>Annotation:</label>
                <input
                    className='form-control form-control-ht'
                    type="text"
                    name="annotation"
                    value={metadata.annotation}
                    onChange={handleChange}
                />
            </div>
            <div>
                {
                    !isRoot &&
                        <SquarePlus
                            style={{ width: 20, cursor: "pointer", fill: 'white' }}
                            disabled={isLocked}
                            onClick={() => addChild(parentId)}
                        />
                }
            </div>
        </div>
    );
};

export default MetadataForm;
