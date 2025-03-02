export function getAverage(solves: number[] | undefined) {
    if (!solves) return "Potrebno 5 slaganja";
    const noFormatAverage = getAverageNoFormat(solves);
    return typeof noFormatAverage === "string"
        ? formatTime(noFormatAverage)
        : noFormatAverage === -1
          ? "Potrebno 5 slaganja"
          : "DNF";
}
export function getAverageNoFormat(solves: number[]) {
    if (solves.length !== 5) {
        return -1;
    }

    // Create a copy of the solves array
    const sortedSolves = solves.slice();

    sortedSolves.sort((a, b) => {
        if (a === 0 && b === 0) return 0;
        if (a === 0) return 1;
        if (b === 0) return -1;
        return a - b;
    });
    // Remove the smallest and largest elements
    const trimmedSolves = sortedSolves.slice(1, sortedSolves.length - 1);

    // Calculate average
    const average =
        trimmedSolves.reduce((acc, val) => acc + val, 0) / trimmedSolves.length;

    // If the trimmed solves include a DNF (0), the entire average is considered a DNF.
    if (trimmedSolves.includes(0)) {
        return 0;
    }

    // Return average rounded to 2 decimal places
    return average.toFixed(2);
}
export function formatTime(seconds: number | string) {
    // Convert seconds to milliseconds and round to the nearest integer
    const ms = Math.round(+seconds * 1000);
    if (ms === 0) return "DNF";
    // Calculate minutes, remaining seconds, and milliseconds
    const minutes = Math.floor(ms / 60000); // Get minutes
    const remainingSeconds = Math.floor((ms % 60000) / 1000); // Get remaining seconds
    const milliseconds = ms % 1000; // Get milliseconds

    // Initialize an array to hold the time parts
    const timeParts = [];

    // If there are minutes, add them to the time parts
    if (minutes > 0) {
        timeParts.push(`${minutes}:`);
    }

    // Add seconds and milliseconds to the time parts
    timeParts.push(`${remainingSeconds.toString().padStart(2, "0")}`);
    timeParts.push(`.${milliseconds.toString().padStart(3, "0").slice(0, 2)}`);
    const formattedTime = timeParts.join("");
    return formattedTime;
}

function onlyNumbersSpacesAndDots(str: string) {
    return /^[0-9 .]*$/.test(str);
}
export function formatInputToSeconds(str: string) {
    if (!onlyNumbersSpacesAndDots(str)) {
        return null;
    }
    // Check if the string is already in the format of a decimal number
    if (str.includes(".")) {
        return parseFloat(parseFloat(str).toFixed(2));
    }

    // Handle formatting based on the length of the string
    switch (str.length) {
        case 1:
            return parseFloat(`0.0${str}`);
        case 2:
            return parseFloat(`0.${str}`);
        case 3:
            return parseFloat(`${str.charAt(0)}.${str.substring(1)}`);
        case 4:
            return parseFloat(`${str.substring(0, 2)}.${str.substring(2)}`);
        case 5:
            return (
                60 * parseInt(str.charAt(0)) +
                parseFloat(`${str.substring(1, 3)}.${str.substring(3)}`)
            );
        case 6:
            return (
                60 * parseInt(str.substring(0, 2)) +
                parseFloat(`${str.substring(2, 4)}.${str.substring(4)}`)
            );
        default:
            return null; // or any other default value for invalid input
    }
}
