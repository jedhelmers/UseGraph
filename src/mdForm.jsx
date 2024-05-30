import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as TrashCan} from './assets/trash-can.svg';
import { ReactComponent as Link} from './assets/link.svg';
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

const LinkBox = () => {

    return (
        <div className='link-box'></div>
    )
}


const validateValue = (valueRef, typeRef) => {
    const value = valueRef.current.children[1].value
    const type = typeRef.current.children[1].value

    switch(type) {
        case "Integer":
            return Number.isInteger(+value)
        case "Float":
            return !!Number.parseFloat(+value)
        case "Boolean":
            return ['TRUE', 'FALSE'].includes(value.toUpperCase())
        default:
            return true
    }
}


const ComboBox = ({ label, name, options, callback }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const typeRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setFilteredOptions(
      options.filter((keyname) =>
        keyname.toLowerCase().includes(value.toLowerCase())
      )
    );

    if (callback) {
        callback(e)
    }
  };

  const handleOptionClick = (e) => {
    setInputValue(e.target.innerText);
    setFilteredOptions([]);

    if (callback) {
        console.log('CLICK')

        callback({
            target: {
                name: name,
                value: e.target.innerText
            }
        })
    }
  };

  const handleClickOutside = (e) => {
    if (typeRef.current && !typeRef.current.contains(e.target)) {
      setFilteredOptions([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='form-group col' ref={typeRef}>
      <label>{label}:</label>
      <input
        className='form-control form-control-ht'
        type="text"
        name={name}
        id="metadata-row-key"
        value={inputValue}
        onChange={handleChange}
        autoComplete="off"
      />
      {filteredOptions.length > 0 && (
        <ul className='list-group' style={{ position: 'absolute', zIndex: 1, top: 70 }}>
          {filteredOptions.map((type, index) => (
            <li
              key={index}
              className='list-group-item'
              onClick={handleOptionClick}
            >
              {type}
            </li>
          ))}
        </ul>
      )}
        <div className='metadata-row-value-key-error form-group col alert-danger rounded p-3 hidden'>
            Empty keys are not allowed.
        </div>
    </div>
  );
};


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
    errorHandler
}) => {
    const [showTrash, setShowTrash] = useState(false)
    const [formData, setFormData] = useState({ ...metadata });
    const [showLinkBox, setShowLinkBox] = useState(false)
    const cardRef = useRef(null)
    const keynameRef = useRef(null)
    const valueRef = useRef(null)
    const typeRef = useRef(null)

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
                const isKeyNameValid = !!value?.length
                validationHandler(keynameRef, isKeyNameValid)
            case 'value':
            case 'type':
                const isValueValid = validateValue(valueRef, typeRef)
                validationHandler(valueRef, isValueValid)
                validationHandler(typeRef, isValueValid)
        }
    }

    const validationHandler = (ref, isValid) => {
        const label = ref?.current?.children[0]
        const errorMessage = ref?.current?.children[2]

        try {
            if (isValid) {
                label.classList.remove('error-text')
                errorMessage.classList.add('hidden')
            } else {
                label.classList.add('error-text')
                errorMessage.classList.remove('hidden')
            }
        } catch (e) {}

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
            <div className='card-item'>
                {/* Left */}
                <div className='space-between reverse-v'>
                    {
                        !isRoot &&
                            <SquarePlus
                                style={{ width: 20, cursor: "pointer", fill: 'white' }}
                                disabled={isLocked}
                                onClick={() => addChild(parentId)}
                            />
                    }
                </div>

                {/* Middle */}
                <div>
                    <div className='full-width space-between'>
                        <div className='full-width space-between center'>
                            {
                                isRoot &&
                                    <div className=''>
                                        <div></div>
                                        <SquarePlusFill
                                            style={{ width: 20, cursor: "pointer" }}
                                            disabled={isLocked}
                                            onClick={() => addChild(parentId)}
                                        />
                                    </div>
                            }
                        </div>

                        <div>
                            {
                                showTrash ? (
                                    <TrashCan
                                        style={{ width: 16, cursor: "pointer", fill: isRoot ? 'inherit' : 'white' }}
                                        disabled={isLocked}
                                        onClick={() => {
                                            handleNodeSelect(parentId)
                                            removeNode(id)
                                        }}
                                    />
                                ) : <div style={{ width: 16 }}></div>
                                    
                            }
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
                        </div>
                        <div></div>
                    </div>

                    <ComboBox name={'keyname'} label={'Test'} options={keynames} callback={handleChange}/>

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
                    <div className='form-group col' ref={valueRef}>
                        <label>Value:</label>
                        <input
                            className='form-control form-control-ht'
                            type="text"
                            name="value"
                            value={metadata.value}
                            onChange={handleChange}
                        />
                        <div className='metadata-row-value-key-error form-group col alert-danger rounded p-3 hidden'>
                            Type validation error
                        </div>
                    </div>
                    {
                        showLinkBox && (
                            <LinkBox />
                        )
                    }
                    <div className='form-group col' ref={typeRef}>
                        <label>Keyname:</label>
                        <input
                            className='form-control form-control-ht'
                            type="text"
                            name="keyname"
                            id="metadata-row-key"
                            value={metadata.keyname}
                            onChange={handleChange}
                        />
                        <datalist
                            className='form-control form-control-ht'
                            style={{ zIndex: 1 }}
                            value={metadata.type}
                            onClick={(e) => {
                                e.target.name = 'keyname'
                                handleChange(e)
                            }}
                        >
                            {keynames.map(type => (
                                <option
                                    key={type}
                                    value={type}
                                >
                                    {type}
                                </option>
                            ))}
                        </datalist>
                    </div>
                    <div className='form-group col' ref={typeRef}>
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

                </div>

                {/* Right */}
                <div>
                    <div className='space-between vertical full-height'>
                        <div>
                            <input
                                type='checkbox'
                                disabled={isLocked}
                                onChange={(e) => setShowTrash(e.target.checked)}
                            />
                        </div>
                        <Link
                            style={{ width: 20, cursor: "pointer", fill: isRoot ? 'inherit' : 'white' }}
                            disabled={isLocked}
                            onClick={(e) => {
                                e.target.value = 'Link'
                                e.target.name = 'type'
                                handleChange(e)
                                setShowLinkBox(!showLinkBox)
                            }}
                        />
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetadataForm;
