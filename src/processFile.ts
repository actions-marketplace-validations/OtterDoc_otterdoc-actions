// import * as core from '@actions/core'

// export async function ProcessFile(filePath: string): Promise<boolean> {
//   // Get the API key from the global state
//   // Dummy value is used if the key is not found
//   const apiKey =
//   core.getInput('key')

//   const initialVersion = document.version
//   const workspaceEdit = new vscode.WorkspaceEdit()
//   const sourceCode = document.getText()
//   const ast = parse(sourceCode, {
//     sourceType: 'module',
//     plugins: ['typescript', 'jsx'],
//     ranges: true,
//     tokens: true
//   })

//   const functionDeclarations: any[] = []
//   const classDeclarations: any[] = []
//   const classMethodDeclarations: any[] = []

//   traverse(ast, {
//     FunctionDeclaration(path) {
//       functionDeclarations.push(path)
//     },
//     ClassDeclaration(path) {
//       classDeclarations.push(path)
//       path.traverse({
//         ClassMethod(innerPath) {
//           classMethodDeclarations.push(innerPath)
//         }
//       })
//     }
//   })
//   // merge into one array
//   const declarations = functionDeclarations.concat(
//     classDeclarations,
//     classMethodDeclarations
//   )
//   // Reverse sort the array to start from the bottom to avoid line clashes
//   declarations.sort((a, b) => b.node.start - a.node.start)

//   // Get the index of the function where the cursor is located
//   // Get the current cursor position
//   const activeEditor = vscode.window.activeTextEditor
//   if (!activeEditor) {
//     throw new Error('No active text editor found.')
//   }

//   const cursorPosition = activeEditor.selection.active

//   // Find the index of the function containing the cursor position
//   let selectedFunctionIndex = -1
//   for (let i = 0; i < declarations.length; i++) {
//     const path = declarations[i]
//     const start = path.node.start
//     const end = path.node.end

//     if (start !== undefined && end !== undefined) {
//       const startPos = document.positionAt(start)
//       const endPos = document.positionAt(end)

//       if (
//         cursorPosition.isAfterOrEqual(startPos) &&
//         cursorPosition.isBeforeOrEqual(endPos)
//       ) {
//         selectedFunctionIndex = i
//         break
//       }
//     }
//   }

//   let totalFunctionsToFetch = 0

//   declarations.map((path, index) => {
//     if (
//       scanType === SCAN_ALL_FUNCTIONS ||
//       (scanType === SCAN_NEW_FUNCTIONS &&
//         getComments(sourceCode, path.node).length === 0) ||
//       (scanType === SCAN_CURRENT_FUNCTION && index === selectedFunctionIndex)
//     ) {
//       totalFunctionsToFetch++
//     }
//   })

//   progress.report({
//     message: `Documenting your code: 0/${totalFunctionsToFetch}`
//   })

//   let fetchedFunctionsCount = 0

//   const fetchedComments = await Promise.all(
//     declarations.map(async (path, index) => {
//       const start = path.node.start
//       const end = path.node.end
//       const typedocComments =
//         start !== undefined && end !== undefined
//           ? getComments(sourceCode, path.node)
//           : []

//       // Fetch comments only for functions that match the scanType conditions
//       if (
//         scanType === SCAN_ALL_FUNCTIONS ||
//         (scanType === SCAN_NEW_FUNCTIONS &&
//           typedocComments.length === SCAN_ALL_FUNCTIONS) ||
//         (scanType === SCAN_CURRENT_FUNCTION && index === selectedFunctionIndex) // selectedFunctionIndex should be the index of the function where the cursor is located
//       ) {
//         const previousComment =
//           typedocComments.length > 0 ? typedocComments[0] : undefined

//         const fetchedComment =
//           start !== undefined && end !== undefined
//             ? await fetchComment(
//                 sourceCode.slice(start, end),
//                 apiKey,
//                 previousComment
//               )
//             : null

//         // Update fetchedFunctionsCount and report progress
//         fetchedFunctionsCount++
//         const progressPercentage = Math.round(
//           (fetchedFunctionsCount / totalFunctionsToFetch) * 100
//         )
//         progress.report({
//           message: `Documenting your code: ${fetchedFunctionsCount}/${totalFunctionsToFetch} (${progressPercentage}%)`
//         })

//         return fetchedComment ? formatComment(fetchedComment) : null
//       }

//       return null
//     })
//   )
//   // Check if we can continue
//   let shouldContinue = true
//   if (document.version !== initialVersion) {
//     progress.report({
//       message: 'The document has been modified. Cancelling the comment update.'
//     })
//     shouldContinue = false
//   }

//   if (cancellationToken.isCancellationRequested) {
//     progress.report({
//       message: 'Documentation update cancelled.'
//     })
//     shouldContinue = false
//   }

//   progress.report({
//     message: 'All done, replacing comments...'
//   })

//   let textEdits: vscode.TextEdit[] = []
//   for (let i = 0; i < declarations.length; i++) {
//     if (!shouldContinue) {
//       break
//     }
//     const path = declarations[i]
//     const start = path.node.start
//     const end = path.node.end

//     if (start !== undefined && end !== undefined) {
//       const typedocComments = getComments(sourceCode, path.node)
//       const newComment = fetchedComments[i]

//       if (newComment) {
//         const funcStartPos = document.positionAt(start)
//         try {
//           if (typedocComments.length === 0) {
//             textEdits.push(
//               await updateComment(document, funcStartPos, null, newComment)
//             )
//           } else {
//             const commentStart = document.getText().indexOf(typedocComments[0])
//             const commentEnd =
//               document
//                 .getText()
//                 .indexOf('\n', commentStart + typedocComments[0].length) - 1 // Subtract 1 to exclude the newline character
//             const endPos = document.positionAt(commentEnd)
//             const startPos = document.positionAt(commentStart)
//             textEdits.push(
//               await updateComment(document, startPos, endPos, newComment)
//             )
//           }
//         } catch (error) {
//           if (error instanceof DocumentVersionChangedError) {
//             shouldContinue = false
//             vscode.window.showErrorMessage(
//               'The current file was changed while trying to edit comments. Cancelling the current operation.'
//             )
//           }
//         }
//       }
//     }
//   }
//   workspaceEdit.set(document.uri, textEdits)
//   await vscode.workspace.applyEdit(workspaceEdit)

//   return true
// }
