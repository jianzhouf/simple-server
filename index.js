#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const Mime = require('mime');

function isExists(pathName) {
  try {
    fs.accessSync(pathName, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

function isFile(pathName) {
  return fs.statSync(pathName).isFile();
}

var server = http.createServer((req, res) => {
  const cwd = path.resolve('.');

  const pathName = path.join(cwd, req.url);

  if (!isExists(pathName)) {
    res.statusCode = 404;
    res.write(`<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>404 - Not Found</title>
		</head>
		<body>`);
    res.write(`<div>404 - Not Found</div>`);
    res.write(`</body>
		</html>`);
    res.end();
    return;
  }

  if (isFile(pathName)) {
    res.statusCode = 200;
    res.setHeader('Content-Type', Mime.getType(path.extname(pathName)));
    fs.createReadStream(pathName).pipe(res);
    return;
  } else {
    const dirs = fs.readdirSync(pathName);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write(`<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Document</title>
		</head>
		<body>`);

    res.write(`<ul>`);
    dirs.forEach((dir) => {
      res.write(
        `<li><a href="${
          (req.url === '/' ? '' : req.url) + '/' + dir
        }">${dir}</a></li>`,
      );
    });

    res.write(`</ul>`);

    res.write(`</body>
		</html>`);
    res.end();
  }
});

const port = process.argv[2] || 8080;
server.listen(port, () => {
  console.log(`当前地址：http://localhost:${port}`);
});
