export function formatBoldDefinitions(text: string): string {
    // Replace markdown-style bold (**text**) with <strong>text</strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
    // Replace line breaks with <br /> tags
    formatted = formatted.replace(/\n/g, "<br />");
  
    return formatted;
  }
  