import React, { useState, useEffect } from 'react';

const MetadataForm = ({ metadata, updateNode, reconstructNestedJSON }) => {
    const [formData, setFormData] = useState({ ...metadata });

    useEffect(() => {
        setFormData({ ...metadata });
    }, [metadata]);

    useEffect(() => {
        // console.log(reconstructNestedJSON(1))
    }, [formData])


    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedNode = { ...metadata, [name]: value };
        updateNode(metadata.id, updatedNode);
    };

    return (
        <div className='metadata-item'>
            <div>
                <label>Keyname:</label>
                <input
                    type="text"
                    name="keyname"
                    value={metadata.keyname}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Value:</label>
                <input
                    type="text"
                    name="value"
                    value={metadata.value}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Type:</label>
                <input
                    type="text"
                    name="type"
                    value={metadata.type}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Units:</label>
                <input
                    type="text"
                    name="units"
                    value={metadata.units}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default MetadataForm;
