"use client"

import { useCallback } from "react"

/**
 * A hook that provides a function to parse HTML strings and extract plain text
 * Handles complex HTML with nested elements, links, and formatting
 */
export function useHtmlParser() {
  /**
   * Parses HTML content and returns plain text
   * @param html - The HTML string to parse
   * @returns Plain text extracted from HTML
   */
  const parseHtml = useCallback((html: string): string => {
    if (!html) return ""

    // Create a temporary DOM element to parse the HTML
    const tempElement = document.createElement("div")
    tempElement.innerHTML = html

    // Get the text content (strips all HTML tags)
    let plainText = tempElement.textContent || tempElement.innerText || ""

    // Clean up extra whitespace
    plainText = plainText.replace(/\s+/g, " ").trim()

    return plainText
  }, [])

  /**
   * Truncates text to a specified length with ellipsis
   * @param text - The text to truncate
   * @param maxLength - Maximum length before truncation
   * @returns Truncated text with ellipsis if needed
   */
  const truncateText = useCallback((text: string, maxLength: number): string => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }, [])

  return {
    parseHtml,
    truncateText,
  }
}

