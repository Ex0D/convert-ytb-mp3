import https from "https";
import fs from "fs";
import path from "path";

export default async (url) =>
{
    const audioPath = `${process.cwd()}\\audio`;
    const filename = `${Date.now()}.weba`;

    // Create write stream to pipe it in audio folder
    const file = fs.createWriteStream(path.join(audioPath, filename));

    // TODO add error catcher (maybe try/catch ?)
    https.get(url, (res) =>
    {
        res.pipe(file);

        file.on('finish', () =>
        {
            file.close();
        });
    });
}