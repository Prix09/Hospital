/**
 * Formats a date string or Date object into a more readable format.
 * Example: '2025-09-30T10:00:00Z' becomes 'September 30, 2025'
 *
 * @param {string | Date} date - The date to format.
 * @returns {string} The formatted date string, or an empty string if the input is invalid.
 */
export const formatDate = (date) => {
    // Check for invalid input to prevent errors
    if (!date) {
        return '';
    }

    try {
        const dateObject = new Date(date);

        // Use the Intl.DateTimeFormat API for robust, locale-aware date formatting.
        // This is the modern and recommended way to format dates in JavaScript.
        const options = {
            year: 'numeric',  // e.g., 2025
            month: 'long',    // e.g., September
            day: 'numeric',     // e.g., 30
            timeZone: 'UTC',  // Ensures consistent output regardless of user's timezone
        };

        return new Intl.DateTimeFormat('en-US', options).format(dateObject);
    } catch (error) {
        console.error("Failed to format date:", date, error);
        return 'Invalid Date'; // Return a fallback string on error
    }
};
