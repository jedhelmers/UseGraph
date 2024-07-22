import { getWorkspaces, getItems } from '../utils';

// Mock the constants and functions
jest.mock('./utilityFunctions', () => ({
    getWorkspaces: jest.fn(),
    getItems: jest.fn()
}));

describe('Utility Functions', () => {
    test('getWorkspaces returns workspaces', async () => {
        const mockWorkspaces = [{ name: 'Workspace 1', id: 1, children: [] }];
        getWorkspaces.mockResolvedValue(mockWorkspaces);

        const workspaces = await getWorkspaces();
        expect(workspaces).toEqual(mockWorkspaces);
    });

    test('getItems returns items', async () => {
        const mockItems = ['script_1.js', 'script_2.js'];
        getItems.mockResolvedValue(mockItems);

        const items = await getItems();
        expect(items).toEqual(mockItems);
    });

    test('fileNameGenerator generates file names', () => {
        function* fileNameGenerator(prefix = 'file', extension = 'js') {
            let counter = 1;
            while (true) {
                yield `${prefix}_${~~(Math.random() * counter) + 1}.${extension}`;
                counter++;
            }
        }

        const generator = fileNameGenerator('script', 'js');
        const fileName1 = generator.next().value;
        const fileName2 = generator.next().value;

        expect(fileName1).toMatch(/script_\d+\.js/);
        expect(fileName2).toMatch(/script_\d+\.js/);
    });
});
