import {readFileSync} from 'fs'

import axios, { AxiosError } from 'axios'

import {parse} from '@babel/parser'
import traverse, {NodePath} from '@babel/traverse'

const API_BASE_URL = "https://www.codescribe.co";

// export enum ScanType {
//   SCAN_ALL_FUNCTIONS = 0,
//   SCAN_NEW_FUNCTIONS,
//   SCAN_CURRENT_FUNCTION
// }

export async function ProcessFile(
  filePath: string
  // scanType = ScanType.SCAN_NEW_FUNCTIONS
): Promise<string> {
  // Get the API key from the global state
  // Dummy value is used if the key is not found
  // const apiKey = core.getInput('key')

  const sourceCode = readFileSync(filePath, 'utf8')

  const ast = parse(sourceCode, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
    ranges: true,
    tokens: true
  })

  const declarations: NodePath[] = []

  traverse(ast, {
    InterfaceDeclaration(path) {
      declarations.push(path)
    },
    FunctionDeclaration(path) {
      declarations.push(path)
    },
    ClassDeclaration(path) {
      declarations.push(path)
      path.traverse({
        ClassMethod(innerPath) {
          declarations.push(innerPath)
        }
      })
    }
  })
  // merge into one array
  // Reverse sort the array to start from the bottom to avoid line clashes
  declarations.sort((a, b) => b.node.start || 0 - (a.node.start || 0))

  console.log('Output Functions text')

  for (const path of declarations) {
    console.log(`Start to end: ${path.node.start} to ${path.node.end}`)
    console.log(
      'Chunk:' + sourceCode.slice(path.node.start || 0, path.node.end || 0)
    )
  }

  return sourceCode

  // const fetchedComments = await Promise.all(
  //   declarations.map(async (path, index) => {
  //     const start = path.node.start || 0
  //     const end = path.node.end || 0
  //     const typedocComments =
  //       start && end ? getComments(sourceCode, path.node) : []

  //     // Fetch comments only for functions that match the scanType conditions
  //     if (
  //       scanType === ScanType.SCAN_ALL_FUNCTIONS ||
  //       (scanType === ScanType.SCAN_NEW_FUNCTIONS &&
  //         typedocComments.length === ScanType.SCAN_ALL_FUNCTIONS)
  //     ) {
  //       const previousComment =
  //         typedocComments.length > 0 ? typedocComments[0] : undefined

  //       // Chris: I think this is where we're awaiting when we should be returning promises?
  //       const fetchedComment =
  //         start !== undefined && end !== undefined
  //           ? await fetchCommentForCodeChunk(
  //               sourceCode.slice(start, end),
  //               apiKey,
  //               previousComment
  //             )
  //           : null

  //       return fetchedComment ? formatComment(fetchedComment) : null
  //     }

  //     return null
  //   })
  // )

  // let textEdits: string = []
  // for (let i = 0; i < declarations.length; i++) {
  //   const path = declarations[i]
  //   const funcStartPos = path.node.start
  //   const end = path.node.end

  //   if (funcStartPos !== undefined && end !== undefined) {
  //     const typedocComments = getComments(sourceCode, path.node)
  //     const newComment = fetchedComments[i]

  //     if (newComment) {
  //       // const funcStartPos = sourceCode.positionAt(start)
  //       try {
  //         if (typedocComments.length === 0) {
  //           textEdits =
  //             textEdits +
  //             (await updateComment(sourceCode, funcStartPos, null, newComment))
  //         } else {
  //           const commentStart = sourceCode.indexOf(typedocComments[0])
  //           const commentEnd =
  //             sourceCode.indexOf(
  //               '\n',
  //               commentStart + typedocComments[0].length
  //             ) - 1 // Subtract 1 to exclude the newline character
  //           const endPos = commentEnd
  //           const startPos = commentStart
  //           textEdits =
  //             textEdits +
  //             (await updateComment(sourceCode, startPos, endPos, newComment))
  //         }
  //       } catch (error) {
  //         console.log(error)
  //       }
  //     }
  //   }
  // }

  // return textEdits
}

// class DocumentVersionChangedError extends Error {
//   constructor(message: string) {
//     super(message)
//     this.name = 'DocumentVersionChangedError'
//   }
// }

// function formatComment(comment: string): string {
//   const match = comment.match(/\/\*\*[\s\S]*?\*\//)
//   return match ? match[0] + '\n' : ''
// }

async function fetchCommentForCodeChunk(
  functionString: string,
  apiKey: string,
  previousComment?: string
): Promise<string> {
  try {
    console.log('Fetching comment from API...')

    if (!apiKey) {
      throw new Error('API key is missing or not provided.')
    }

    console.log('API key is present:', apiKey)

    const response = await axios.post(`${API_BASE_URL}/api/getComment`, {
      apiKey,
      functionString,
      previousComment
    })

    console.log('Got response from API', response)
    return response.data.comment
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const statusCode = error.response.status
      const errorMessage = error.response.data?.message || 'Unknown error'

      if (statusCode === 401) {
        throw new Error(`API Key no longer active. Please login again.`)
      }

      throw new Error(
        `Failed to fetch comment from API (HTTP status code: ${statusCode}): ${errorMessage}`
      )
    }

    throw new Error(
      'Failed to fetch comment from API: ' + (error as Error).message
    )
  }
}

// function updateComment(
//   document: string,
//   start: vscode.Position,
//   end: vscode.Position | null,
//   newComment: string
// ): vscode.TextEdit {
//   let lineWithFunction = document.lineAt(start.line + 1)

//   while (
//     lineWithFunction.text.trim().startsWith('*') ||
//     lineWithFunction.text.trim().startsWith('*/')
//   ) {
//     lineWithFunction = document.lineAt(lineWithFunction.lineNumber + 1)
//   }

//   const originalIndentation = document.lineAt(start.line).text.match(/^\s*/)![0]

//   const lineWithCode = document.lineAt(start.line).text

//   if (lineWithCode.startsWith('/**')) {
//     // There is an existing typedoc comment
//     const commentEndPosition = document.positionAt(
//       document.getText().indexOf('*/', start.character)
//     )
//     const replaceRange = new vscode.Range(
//       start,
//       commentEndPosition.translate(0, 2)
//     )

//     const indentedCommentLines = newComment
//       .split('\n')
//       .map((line, index) => {
//         if (index === 0) {
//           return line
//         } else {
//           return originalIndentation + line.trimStart()
//         }
//       })
//       .join('\n')

//     return vscode.TextEdit.replace(replaceRange, indentedCommentLines)
//   } else {
//     // There is no existing typedoc comment
//     const indentedCommentLines =
//       newComment
//         .split('\n')
//         .filter(line => line)
//         .map(line => originalIndentation + line.trimStart())
//         .join('\n') + '\n'
//     const insertPosition = new vscode.Position(start.line, 0)
//     return vscode.TextEdit.insert(insertPosition, indentedCommentLines)
//   }
// }

// function getComments(sourceCode: string, node: any): string[] {
//   const leadingComments = node.leadingComments
//   if (!leadingComments) {
//     return []
//   }
//   const commentText = sourceCode.slice(
//     leadingComments[0].start,
//     leadingComments[leadingComments.length - 1].end
//   )
//   const typedocComments = Array.from(
//     commentText.matchAll(/\/\*\*[\s\S]*?\*\//g),
//     match => match[0]
//   )
//   return typedocComments
// }
