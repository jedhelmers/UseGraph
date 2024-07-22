// TODO: Get workspaces properly
const WORKSPACES = [{
    name: "Butts",
    id: 0,
    children: [
        {
            name: 'Child of Butts',
            id: 1,
            children: []
        }
    ]
}]

/**
 * Generator function for creating unique file names with a specified prefix and extension.
 *
 * @param {string} [prefix='file'] - The prefix for the file names.
 * @param {string} [extension='js'] - The file extension for the file names.
 * @yields {string} - A file name in the format `${prefix}_${counter}.${extension}`, where `counter` increments with each yield.
 */
function* fileNameGenerator(prefix = 'file', extension = 'js') {
    let counter = 1;
    while (true) {
        yield `${prefix}_${~~(Math.random() * counter) + 1}.${extension}`;
        counter++;
    }
}

const generator = fileNameGenerator('script', 'js');

/**
 * Generates an array of random file names using the `fileNameGenerator`.
 *
 * @returns {Array<string>} - An array of file names with a random number of elements (up to 10).
 */
const ITEMS = () => {
    return new Array(~~(Math.random() * 10)).fill(0).map((_, i) => generator.next().value)
}

/**
 * Asynchronously retrieves a list of file names.
 *
 * @returns {Promise<Array<string>>} - A promise that resolves to an array of file names.
 */
const getItems = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(ITEMS())
        }, 1000);
    })
}

/**
 * Asynchronously retrieves a predefined list of workspaces.
 *
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of workspace objects.
 */
const getWorkspaces = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(WORKSPACES)
        }, 300);
      })
}

export {
    getWorkspaces,
    getItems
}
