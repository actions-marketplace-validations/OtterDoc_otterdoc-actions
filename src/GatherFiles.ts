// /* deprecated */
// import fs from 'fs/promises'
// import path from 'path'
// import ignore, {Ignore} from 'ignore'
// import {CommentFile} from './processFile'
// // import { document_js_ts } from './document_js_ts';

// export const processFile = async (file: string) => {
//   const ext = path.extname(file)
//   switch (ext) {
//     case '.js':
//       await CommentFile(file)
//       break
//     case '.ts':
//       await CommentFile(file)
//       break
//     // Add more cases if needed
//   }
// }

// const readIgnoreFile = async (basePath: string, filename: string) => {
//   const filePath = path.join(basePath, filename)
//   try {
//     const fileContent = await fs.readFile(filePath, 'utf-8')
//     return ignore().add(fileContent)
//   } catch (error) {
//     return null
//   }
// }

// const traverseDirectory = async (
//   directoryPath: string,
//   basePath: string,
//   ig: Ignore | null
// ) => {
//   let filesAndFolders
//   try {
//     filesAndFolders = await fs.readdir(directoryPath, {withFileTypes: true})
//   } catch (error) {
//     console.error(`Failed to read this directory 1: ${directoryPath}`)
//     return
//   }

//   const tasks = filesAndFolders.map(async entry => {
//     const entryPath = path.join(directoryPath, entry.name)
//     const relativePath = path.relative(basePath, entryPath)

//     if (ig && ig.ignores(relativePath)) {
//       // console.log(`Skipping ignored path: ${entryPath}`);
//       return
//     }

//     if (entry.isFile()) {
//       try {
//         await processFile(entryPath)
//       } catch (error) {
//         console.error(`Failed to process file: ${entryPath}`)
//       }
//     } else if (entry.isDirectory()) {
//       await traverseDirectory(entryPath, basePath, ig)
//     }
//   })

//   await Promise.all(tasks)
// }

// export const documentRepo = async (basePath: string) => {
//   console.log(`Running OtterDoc on the following path: ${basePath}`)

//   const gitignore = await readIgnoreFile(basePath, '.gitignore')
//   const dockerignore = await readIgnoreFile(basePath, '.dockerignore')

//   // Create a combined ignore object
//   const combinedIgnore = ignore()
//   if (gitignore) {
//     combinedIgnore.add(gitignore)
//   }
//   if (dockerignore) {
//     combinedIgnore.add(dockerignore)
//   }

//   if (combinedIgnore) {
//     console.log('OLD: Skipping files based on ignore config')
//   }

//   await traverseDirectory(basePath, basePath, combinedIgnore)
// }
