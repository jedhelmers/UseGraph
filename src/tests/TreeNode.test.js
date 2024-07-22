import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MetadataTreeDisplay, Tree, TreeNode } from '../components/TreeNode';

const mockData = {
    id: 0,
    keyname: 'root',
    children: [
        {
            id: 1,
            keyname: 'child1',
            children: []
        },
        {
            id: 2,
            keyname: 'child2',
            children: [
                {
                    id: 3,
                    keyname: 'grandchild1',
                    children: []
                }
            ]
        }
    ]
};

const mockErrors = [];
const mockParentChain = [];
const mockSetCurrentNode = jest.fn();
const mockCurrentNode = { id: 1 };

describe('TreeNode Component', () => {
    test('renders TreeNode component', () => {
        render(<TreeNode
            node={mockData}
            errors={mockErrors}
            parentChain={mockParentChain}
            isLocked={false}
            setCurrentNode={mockSetCurrentNode}
            currentNode={mockCurrentNode}
        />);

        expect(screen.getByText('root')).toBeInTheDocument();
    });

    test('expands and collapses children', () => {
        render(<TreeNode
            node={mockData}
            errors={mockErrors}
            parentChain={mockParentChain}
            isLocked={false}
            setCurrentNode={mockSetCurrentNode}
            currentNode={mockCurrentNode}
        />);

        const expandButton = screen.getByRole('button', { name: '' });
        fireEvent.click(expandButton);

        expect(screen.getByText('child1')).toBeInTheDocument();
        expect(screen.getByText('child2')).toBeInTheDocument();

        fireEvent.click(expandButton);

        expect(screen.queryByText('child1')).not.toBeInTheDocument();
        expect(screen.queryByText('child2')).not.toBeInTheDocument();
    });

    test('handles node selection', () => {
        render(<TreeNode
            node={mockData}
            errors={mockErrors}
            parentChain={mockParentChain}
            isLocked={false}
            setCurrentNode={mockSetCurrentNode}
            currentNode={mockCurrentNode}
        />);

        const navigateButton = screen.getByText('root');
        fireEvent.click(navigateButton);

        expect(mockSetCurrentNode).toHaveBeenCalledWith(0);
    });
});

describe('Tree Component', () => {
    test('renders Tree component', () => {
        render(<Tree
            data={mockData}
            errors={mockErrors}
            parentChain={mockParentChain}
            isLocked={false}
            setCurrentNode={mockSetCurrentNode}
            currentNode={mockCurrentNode}
        />);

        expect(screen.getByText('root')).toBeInTheDocument();
    });
});

describe('MetadataTreeDisplay Component', () => {
    test('renders MetadataTreeDisplay component', () => {
        const mockReconstructNestedJSON = jest.fn().mockReturnValue(mockData);

        render(<MetadataTreeDisplay
            rootId={0}
            isLocked={false}
            errors={mockErrors}
            reconstructNestedJSON={mockReconstructNestedJSON}
            setCurrentNode={mockSetCurrentNode}
            currentNode={mockCurrentNode}
            parentChain={mockParentChain}
        />);

        expect(screen.getByText('root')).toBeInTheDocument();
    });
});
