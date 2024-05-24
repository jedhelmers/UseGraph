import React, { useState, useEffect, useRef } from 'react';


const MetadataForm = ({ metadata, updateNode, addChild, handleNodeSelect, id, isRoot, errorHandler }) => {
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
        // if (isValueValid(e)) {
        //     console.log('VALID:', name)
        // } else {
        //     console.log('ERROR:', name)
        // }
        isValueValid(e)

        const updatedNode = { ...metadata, [name]: value };
        updateNode(metadata.id, updatedNode);
    };

    // metadata-item card card-body card-ht metadata-card parent-card
    // metadata-item card card-body card-ht metadata-card child-card mb-3

    return (
        <div ref={cardRef} className='metadata-item card card-body card-ht metadata-card child-card mb-3'>
            <div>
                {
                    !isRoot &&
                        <button onClick={() => handleNodeSelect(id)}>
                            View This Child
                        </button>
                }
                {
                    isRoot &&
                        <button onClick={() => addChild(id)}>
                            +
                        </button>
                }
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
                <input
                    className='form-control form-control-ht'
                    type="text"
                    name="type"
                    value={metadata.type}
                    onChange={handleChange}
                />
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
            <div>
                {
                    !isRoot &&
                        <button onClick={() => addChild(id)}>
                            +
                        </button>
                }
            </div>
        </div>
    );
};

export default MetadataForm;
