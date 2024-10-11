import * as fs from 'fs/promises';
import * as path from 'path';

async function getFolderSize(folderPath: string): Promise<number> {
    const files = await fs.readdir(folderPath);
    let totalSize = 0;

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
            totalSize += stats.size;
        } else if (stats.isDirectory()) {
            totalSize += await getFolderSize(filePath);
        }
    }

    return totalSize;
}

export async function ensureUploadsFolder(uploadsPath:string) {
    const maxFolderSize = 100 * 1024 * 1024; // 100MB in bytes

    const folderSize = await getFolderSize(uploadsPath);

    if (folderSize > maxFolderSize) {
        throw new Error("Your request cannot be processed at this time !");
    }
}
