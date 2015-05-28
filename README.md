# firebase-to-csv
Node.js module for creating CSV backups of firebase databases.

Module is pretty simple. It has a CLI version and a non CLI version, and will detect whether it's being loaded in as a module. If you use it as a module the API is pretty simple. It exports one function, fetch.

## Installation

  npm install firebase-to-csv

## Api

  - [$firebaseCSVService(url, next, filepath)]

### $firebaseCSVService
  url: The Firebase URL endpoint you want to export
  next: callback function. Parameter can either be a `ReadableStream` or the return value of whether the write was successful.
  filepath: Optional. The path of the file to write to

  If you provide a callback and no filepath, the program assumes you will stream it into the file yourself. In that case, the parameter of the callback will be a ReadableStream. You can then pipe your write function.

## CLI

If you use the CLI program, the last parameter is the filepath and the second to last is the url of the firebase application. If there is no filepath, it defaults to export.csv in the current directory.
