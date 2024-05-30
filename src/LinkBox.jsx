import React, { useEffect, useState } from 'react'
import { WorkspaceTree } from './WorkspaceTree.jsx'

const WORKSPACES = [{
    name: "Butts",
    id: 0,
    children: [
        {
            name: 'Child of Butts',
            id: 1,
            children: [{
                name: "Butts",
                id: 2,
                children: [
                    {
                        name: 'Child of Butts',
                        id: 3
                    }
                ]
            }]
        }
    ]
}]

const LinkBox = () => {
    const [currentNode, setCurrentNode] = useState({id: 0})

    useEffect(() => {
        console.log('currentNode', currentNode)
    }, [currentNode])

    return (
        <div className='link-box'>
            <div className='body'>
                <div className='tree'>
                    <WorkspaceTree data={WORKSPACES} setCurrentNode={setCurrentNode} currentNode={currentNode}/>
                </div>
                <div className='content'>ho</div>
            </div>
            <div className='buttons'>
                <button className='btn btn-ht-secondary fmb-cancel'>Cancel</button>
                <button className='btn btn-ht-primary fmb-select'>Select</button>
            </div>
        </div>
    )
}

export default LinkBox