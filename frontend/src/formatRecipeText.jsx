const formatRecipeText = (text) => {
    if (text == null)
        return null;
    // Apply strong formatting for bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Format markdown-style headers
    text = text.replace(/^##\s+(.*)$/gm, '<h3>$1</h3>');

    // Separate the text into lines for individual processing
    const lines = text.split('\n');
    const formattedLines = lines.map(line => {
        if (/^\d+\.\s/.test(line)) { // Matches numbered lines
            return `<li>${line.substring(line.indexOf('.') + 1).trim()}</li>`; // Formats as ordered list items
        } else if (line.trim().startsWith('*')) { // Matches bullet list items
            return `<li>${line.substring(1).trim()}</li>`; // Formats as unordered list items
        }
        return line;
    }).join('\n');

    // Encapsulate list items within <ul> or <ol> tags
    return { __html: formattedLines
        .replace(/<li>(\d+\..*?)<\/li>/gs, '<ol>$&</ol>') // Wrap numbered items in ordered list
        .replace(/<li>(?!<ol>.*<\/ol>).*?<\/li>/gs, '<ul>$&</ul>') // Wrap other list items in unordered list
    };
};

export default formatRecipeText;
