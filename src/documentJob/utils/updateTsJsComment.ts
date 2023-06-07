import * as ts from 'typescript'

const formatDocumentation = (
  documentation: string,
  indentation: string
): string => {
  // Split the documentation into lines
  let documentationLines = documentation.split('\n')

  // Format the documentation lines
  documentationLines = documentationLines.map((line, index) => {
    line = line.trim()
    if (index === 0) {
      return `${indentation}/**`
    } else if (index === documentationLines.length - 1) {
      return `${indentation} */`
    } else {
      return `${indentation} ${line}`
    }
  })

  // Join the lines back together into a single comment
  return documentationLines.join('\n')
}

export const replaceOrInsertComment = (
  fileContentLines: string[],
  fileContent: string,
  part: {
    documentation?: string;
    lineNumber?: number;
    leadingComments?: {comment: string; range: ts.TextRange}[];
  }
): string[] => {
  if (part.documentation !== undefined) {
    // Get indentation from the line of code
    const indentation =
      fileContentLines[part.lineNumber! - 1].match(/^\s*/)?.[0] ?? ''
    // Format the documentation
    const comment = formatDocumentation(part.documentation, indentation)

    // Check if existing comment is present
    if (part.leadingComments && part.leadingComments.length > 0) {
      // Get the old comment
      const leadingComment = part.leadingComments[0]

      // Calculate the line numbers of the comment in the source file
      const startLineNumber = fileContent
        .substring(0, leadingComment.range.pos)
        .split('\n').length
      const endLineNumber = fileContent
        .substring(0, leadingComment.range.end)
        .split('\n').length

      // Check if the comment in the source code matches the comment we recorded
      const commentInFile = fileContentLines
        .slice(startLineNumber - 1, endLineNumber)
        .join('\n')
      // helper arrow function
      const normalizeWhitespace = (str: string): string =>
        str.replace(/\s+/g, ' ').trim()
      if (
        normalizeWhitespace(commentInFile) ===
        normalizeWhitespace(leadingComment.comment)
      ) {
        // Replace the old comment with the new one
        fileContentLines.splice(
          startLineNumber - 1,
          endLineNumber - startLineNumber + 1,
          ...comment.split('\n')
        )
      } else {
        console.log(
          `Existing comment does not match the recorded comment: ${commentInFile}`
        )
        console.log(`Recorded comment: ${leadingComment.comment}`)
      }
    } else {
      // Insert the comment at the appropriate line
      fileContentLines.splice(part.lineNumber! - 1, 0, comment)
    }
  }
  return fileContentLines
}
