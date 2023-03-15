/**
 * @description Generate a "random" string
 * @param {Number} n Number of characters
 * @returns {String}
 */
export default (n) =>
{
    let result = '';
    const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charL = char.length;

    for (let i = 0; i < n; i++) 
    {
        result += char.charAt(Math.floor(Math.random() * charL));
    }
    return result;
}