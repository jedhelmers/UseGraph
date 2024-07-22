import { renderHook, act } from '@testing-library/react-hooks-testing-library';
import useGraph from '../useGraph';

describe('useGraph Hook', () => {
    test('adds and retrieves nodes', () => {
        const { result } = renderHook(() => useGraph());

        act(() => {
            result.current.addNode({ id: 1, keyname: 'Node 1' });
        });

        const node = result.current.getNode(1);
        expect(node).toEqual(expect.objectContaining({ id: 1, keyname: 'Node 1' }));
    });

    test('updates nodes', () => {
        const { result } = renderHook(() => useGraph());

        act(() => {
            result.current.addNode({ id: 1, keyname: 'Node 1' });
            result.current.updateNode(1, { keyname: 'Updated Node 1' });
        });

        const node = result.current.getNode(1);
        expect(node).toEqual(expect.objectContaining({ keyname: 'Updated Node 1' }));
    });

    test('sets and gets current node', () => {
        const { result } = renderHook(() => useGraph());

        act(() => {
            result.current.addNode({ id: 1, keyname: 'Node 1' });
            result.current.setCurrentNode(1);
        });

        const currentNode = result.current.getCurrentNode();
        expect(currentNode).toEqual(expect.objectContaining({ id: 1 }));
    });

    test('adds child nodes', () => {
        const { result } = renderHook(() => useGraph());

        act(() => {
            result.current.addNode({ id: 1, keyname: 'Node 1' });
            result.current.addNode({ id: 2, keyname: 'Node 2' });
            result.current.addChild(1, 2);
        });

        const parentNode = result.current.getNode(1);
        expect(parentNode.children).toContain(2);
    });

    test('removes nodes', () => {
        const { result } = renderHook(() => useGraph());

        act(() => {
            result.current.addNode({ id: 1, keyname: 'Node 1' });
            result.current.removeNode(1);
        });

        const node = result.current.getNode(1);
        expect(node).toBeUndefined();
    });

    test('reconstructs nested JSON', () => {
        const { result } = renderHook(() => useGraph());

        act(() => {
            result.current.addNode({ id: 1, keyname: 'Node 1' });
            result.current.addNode({ id: 2, keyname: 'Node 2' });
            result.current.addChild(1, 2);
        });

        const nestedJSON = result.current.reconstructNestedJSON(1);
        expect(nestedJSON).toEqual(expect.objectContaining({
            id: 1,
            children: [expect.objectContaining({ id: 2 })]
        }));
    });
});
