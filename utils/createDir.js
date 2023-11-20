import { mkdir } from "fs";

/**
 * @description Make a dir and silent some error if happen
 * @param {String} path
 * @return {void}
 */
export default (path) =>
{
    mkdir(path, () =>
    {
        // Avoid throw error "EEXIST: dir already exist"
        return;
    });
};