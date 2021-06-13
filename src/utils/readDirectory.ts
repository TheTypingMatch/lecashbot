import * as fs from 'fs';
import * as path from 'path';

const readDirectory = (dir: any) => {
    let results: string[] = [];
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.resolve(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            const res = readDirectory(filePath);
            results = results.concat(res);
        } else results.push(filePath);
    }

    return results;
};

export default readDirectory;
