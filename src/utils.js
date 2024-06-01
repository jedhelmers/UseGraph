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



function* fileNameGenerator(prefix = 'file', extension = 'js') {
    let counter = 1;
    while (true) {
        yield `${prefix}_${~~(Math.random() * counter) + 1}.${extension}`;
        counter++;
    }
}

const generator = fileNameGenerator('script', 'js');

const ITEMS = () => {
    return new Array(~~(Math.random() * 10)).fill(0).map((_, i) => generator.next().value)
}

const getItems = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(ITEMS)
        }, 1000);
    })
}

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