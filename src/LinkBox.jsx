import React, { useEffect, useState } from 'react';
import { WorkspaceTree } from './WorkspaceTree.jsx';
import { getWorkspaces, getItems } from './utils.js';

/**
 * LinkBox component that allows users to select a file from a workspace.
 *
 * Manages states for savability, workspaces, selected workspace, selected file, file list, and the current node.
 *
 * @param {object} props - Component props.
 * @param {Function} props.handleChange - Function to handle changes in selection.
 * @param {string} props.value - Current value for the link box.
 * @param {Function} props.hideLinkBox - Function to hide the link box.
 * @return {React.Component} The LinkBox component.
 */
const LinkBox = ({ handleChange, value, hideLinkBox }) => {
    const [savable, setSavable] = useState(false);
    const [workspaces, setWorkspaces] = useState([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [selecteFile, setSelecteFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [currentNode, setCurrentNode] = useState({ id: 0 });

    /**
     * Handles selection of a workspace from the tree.
     *
     * @param {number} id - ID of the selected workspace.
     */
    const onTreeRowSelect = (id) => {
        setSelectedWorkspace(workspaces.filter(space => space.id === id));
        setCurrentNode({ id });
    };

    /**
     * Marks the component as savable and triggers the handleChange function.
     */
    const save = () => {
        setSavable(true);
        const e_type = {
            target: {
                name: 'type',
                value: 'Link'
            }
        };
        handleChange(e_type);
    };

    useEffect(() => {
        if (savable) {
            const e_value = {
                target: {
                    name: 'value',
                    value: fileList[selecteFile]
                }
            };
            handleChange(e_value);
            hideLinkBox();
        }
    }, [savable]);

    useEffect(() => {
        getWorkspaces().then(setWorkspaces);
    }, []);

    useEffect(() => {
        setFileList([]);
        getItems().then(setFileList);
    }, [selectedWorkspace]);

    return (
        <div className='link-box'>
            <div className='body'>
                <div className='tree'>
                    <WorkspaceTree data={workspaces} setCurrentNode={onTreeRowSelect} currentNode={currentNode} />
                </div>
                <div className='content'>
                    {
                        fileList.map((item, i) => (
                            <div
                                key={i}
                                className={['file-list-row', i === selecteFile ? 'selected' : ''].join(' ')}
                                name='value'
                                onClick={() => setSelecteFile(i)}
                            >
                                {item}
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className='buttons'>
                <button
                    className='btn btn-ht-secondary fmb-cancel'
                    onClick={hideLinkBox}
                >
                    Cancel
                </button>
                <button
                    className='btn btn-ht-primary fmb-select'
                    onClick={save}
                >
                    Select
                </button>
            </div>
        </div>
    );
};

export default LinkBox;
