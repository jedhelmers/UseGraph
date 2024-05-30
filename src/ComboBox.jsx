import React, { useState, useEffect, useRef } from 'react';


const ComboBox = ({ label, value, name, options, callback }) => {
    const [inputValue, setInputValue] = useState(value);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const typeRef = useRef(null);

    const handleChange = (e) => {
      const value = e.target.value;
      setInputValue(value);
      setFilteredOptions(
        options.filter((option) =>
          option.toLowerCase().includes(value.toLowerCase())
        )
      );

      if (callback) {
        callback(e);
      }
    };

    const handleOptionClick = (option) => {
      setInputValue(option);
      setFilteredOptions([]);

      if (callback) {
        callback({
          target: {
            name,
            value: option,
          },
        });
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

    useEffect(() => {
        setInputValue(value)
    }, [value])

    return (
      <div className='combo-box' ref={typeRef}>
        <label>{label}:</label>
        <input
          className='form-control form-control-ht'
          type='text'
          name={name}
          value={inputValue}
          onChange={handleChange}
          autoComplete='off'
        />
        {filteredOptions.length > 0 && (
          <ul className='list-group'>
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className='list-group-item'
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
};

export default ComboBox