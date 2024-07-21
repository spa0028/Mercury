//this was written by ChatGPT but it doesn't run in the actual program so it doesn't really count
//I only used it to edit the SVG textures

function scalePathData(pathData, scale, precision = 2) {
    // Function to format a number with trailing zeros removed and leading zero removed
    function formatNumber(num) {
        // Parse the number and remove trailing zeros
        let parsedNum = parseFloat(num);
        if (parsedNum === 0) return '0'; // Special case for zero
        let formattedNum = parsedNum.toFixed(precision).replace(/\.?0+$/, ''); // Remove trailing zeros
        return formattedNum.replace(/^0+/, ''); // Remove leading zero
    }

    // Function to parse and scale a single command in the path data
    function scaleCommand(command, scale, precision) {
        const commandType = command[0];

        // Scale the coordinates in the command
        return command.replace(/[+-]?\d*\.?\d+(?:e[+-]?\d+)?/gi, (num) => {
            // Parse the number and scale it
            const parsedNum = parseFloat(num);
            // Apply the scale factor and format to the specified precision
            const scaledNum = formatNumber((parsedNum * scale).toFixed(precision));
            return ` ${scaledNum} `; // Add spaces around the scaled number
        });
    }

    // Split the path data into individual commands
    const commands = pathData.match(/([a-zA-Z][^a-zA-Z]*)/g);

    // Scale each command
    const scaledCommands = commands.map(command => scaleCommand(command, scale, precision));

    // Join the scaled commands back into a single string
    let result = scaledCommands.join('').trim();

    // Remove excessive whitespaces and handle spaces between number symbols and letter commands
    result = result.replace(/\s+/g, ' '); // Convert multiple spaces to a single space
    result = result.replace(/([a-zA-Z])\s+([+-]?\d)/g, '$1$2'); // Remove space between letter and number
    result = result.replace(/([+-]?\d)\s+([a-zA-Z])/g, '$1$2'); // Remove space between number and letter
    result = result.replace(/(\d)\s+(-\d)/g, '$1$2'); // Join positive and negative numbers together

    return result;
}
