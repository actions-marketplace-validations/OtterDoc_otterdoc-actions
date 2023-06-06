import fs from 'fs'
import ts from 'typescript'
import {encode} from 'gpt-3-encoder'
import axios from 'axios'
import {config as dotenvConfig} from 'dotenv'
dotenvConfig()

const config = JSON.parse(fs.readFileSync('./otterconfig.json', 'utf8'))

interface ResponseData {
  comment: string
  // Define other properties here if necessary
}

interface ExtractOptions {
  ArrowFunctionExpression?: boolean
  ClassDeclaration?: boolean
  ClassMethod?: boolean
  FunctionDeclaration?: boolean
  InterfaceDeclaration?: boolean
  TypeAlias?: boolean
  EnumDeclaration?: boolean
}

interface DocumentablePart {
  type: string
  code: string
  isPublic: boolean
  lineNumber?: number
  documentation?: string
  leadingComments?: {comment: string; range: ts.TextRange}[]
}

const generateDocumentation = async (
  part: DocumentablePart
): Promise<string> => {
  if (config.debug) {
    // Return static comment
    return `/**
* Represents a network with Ethereum Virtual Machine (EVM) capabilities.
*
* @class
* @extends Network
*/`
  } else {
    try {
      const response = await axios.post('http://www.otterdoc.ai/api/getComment', {
        // Replace YOUR_ENDPOINT with the endpoint of your server function
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: process.env.OTTERDOC_API_KEY,
          functionString: part.code,
          previousComment: part.documentation,
          funcType: part.type
          // Add other required fields here
        })
      })

      if (!response.data) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log('Got response from API', response.data)
      const data = (await response.data.json()) as ResponseData
      const documentation = data.comment
      return documentation
    } catch (error) {
      console.error('Error during API request:', error)
      return 'failed to connect'
    }
  }
}

const extractDocumentableParts = (
  code: string,
  options: ExtractOptions
): DocumentablePart[] => {
  const documentableParts: DocumentablePart[] = []

  function isOptionKey(
    key: string,
    options: ExtractOptions
  ): key is keyof ExtractOptions {
    return Object.keys(options).some(
      optionKey => optionKey === key && options[key as keyof ExtractOptions]
    )
  }

  const sourceFile = ts.createSourceFile(
    'example.js',
    code,
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ true
  )

  const visit = (node: ts.Node): void => {
    let type: string | undefined
    if (ts.isClassDeclaration(node)) {
      type = 'ClassDeclaration'
    } else if (ts.isMethodDeclaration(node)) {
      type = 'ClassMethod'
    } else if (ts.isFunctionDeclaration(node)) {
      type = 'FunctionDeclaration'
    } else if (ts.isInterfaceDeclaration(node)) {
      type = 'InterfaceDeclaration'
    } else if (ts.isTypeAliasDeclaration(node)) {
      type = 'TypeAlias'
    } else if (ts.isEnumDeclaration(node)) {
      type = 'EnumDeclaration'
    } else if (
      ts.isPropertyDeclaration(node) &&
      node.initializer &&
      ts.isArrowFunction(node.initializer)
    ) {
      type = 'ArrowFunctionExpression'
    }

    if (type && isOptionKey(type, options)) {
      const start =
        sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1
      const getJSDocComments = (
        node: ts.Node
      ): {comment: string; range: ts.TextRange}[] => {
        const isJSDocComment = (
          comment: ts.CommentRange
        ): boolean => {
          const commentText = sourceFileText.slice(comment.pos, comment.end)
          return (
            commentText.startsWith('/**') && !commentText.startsWith('/***')
          )
        }
        const sourceFileText = node.getSourceFile().getText()
        const comments: {comment: string; range: ts.CommentRange}[] = []
        ts.forEachLeadingCommentRange(
          sourceFileText,
          node.pos,
          (pos, end, kind) => {
            const commentRange: ts.CommentRange = {pos, end, kind}
            if (isJSDocComment(commentRange)) {
              comments.push({
                comment: sourceFileText.slice(pos, end),
                range: commentRange
              })
            }
          }
        )
        return comments
      }

      const isNodePublic = (node: ts.Node): boolean => {
        if (ts.isClassElement(node)) {
          const modifiers = ts.getCombinedModifierFlags(node)
          return !(
            modifiers &
            (ts.ModifierFlags.Private | ts.ModifierFlags.Protected)
          )
        } else if (
          ts.isClassDeclaration(node) ||
          ts.isFunctionDeclaration(node) ||
          ts.isInterfaceDeclaration(node) ||
          ts.isTypeAliasDeclaration(node) ||
          ts.isEnumDeclaration(node)
        ) {
          return (
            node.modifiers !== undefined &&
            node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
          )
        }
        return false
      }
      let isPublic = isNodePublic(node)

      documentableParts.push({
        type,
        code: node.getText(),
        isPublic,
        lineNumber: start,
        leadingComments: getJSDocComments(node)
      })
    }

    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return documentableParts
}

const options: ExtractOptions = {
  ArrowFunctionExpression: true,
  ClassDeclaration: true,
  ClassMethod: true,
  FunctionDeclaration: true,
  InterfaceDeclaration: true,
  TypeAlias: true,
  EnumDeclaration: true
}

const formatDocumentation = (documentation: string, indentation: string): string => {
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

export const documentJsTs = async (file: string): Promise<void> => {
  console.log(`Documenting file: ${file}`)
  let fileContent = fs.readFileSync(file, 'utf8')
  let documentableParts = extractDocumentableParts(fileContent, options)

  // Sort documentableParts in descending order by lineNumber
  documentableParts = documentableParts.sort(
    (a, b) => b.lineNumber! - a.lineNumber!
  )

  // Create a copy of the file content split by lines
  const fileContentLines = fileContent.split('\n')

  for (const part of documentableParts) {
    // Check if the part exceeds the token limit
    const tokens = encode(part.code)
    if (tokens.length > 4096) {
      console.log(`Part exceeds the token limit: ${part.code}`)
      continue
    }

    // Generate the documentation for this part
    part.documentation = await generateDocumentation(part)
    if (part.documentation) {
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
  }

// Join the modified file content
const updatedFileContent = fileContentLines.join('\n')

// Write the modified file content to the original file, thus overwriting it
fs.writeFileSync(file, updatedFileContent)

console.log(documentableParts)
}
