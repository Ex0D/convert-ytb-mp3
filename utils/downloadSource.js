import https from "https";
import fs from "fs";
import path from "path";

export default async (url) =>
{
    const audioPath = `${process.cwd()}\\audio`;
    // For some reason, renaming directly in .mp3 make the file "empty" or "unreadable" so once the file stream is closed, rename it
    const filename = `${Date.now()}.weba`;
    const filepath = path.join(audioPath, filename);

    // Create write stream to pipe it in audio folder
    const file = fs.createWriteStream(filepath);

    // TODO add error catcher (maybe try/catch ?)
    https.get(url, (res) =>
    {
        res.pipe(file);

        file.on('finish', () =>
        {
            file.close();
            fs.renameSync(filepath, filepath.replace('weba', 'mp3'));
        });
    });
}