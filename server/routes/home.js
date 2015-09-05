const {
  HOST = 'localhost',
  WEBPACK_PORT = 3000,
  NODE_ENV = 'production'
} = process.env

// During development the bundle.js is being servied from webpack-hot-server in the gulpfile
// so we must switch the source
const bundleSrc = NODE_ENV === 'development' ? `http://${HOST}:${WEBPACK_PORT}` : ''
const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Plex Compare</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
</head>
<body>
  <div id="app"></div>
  <script src="${bundleSrc}/public/bundle.js"></script>
</body>
</html>
`

export function get(req, res) {
  res.send(indexHtml)
}
