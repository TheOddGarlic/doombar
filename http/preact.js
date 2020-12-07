/*
 * Copyright (c) 2020 sanana the skenana
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const { existsSync, createReadStream } = require('fs')
const mime = require('mime-types')

const { h } = require('preact')
const renderToString = require('preact-render-to-string')

const { Router } = require('wouter-preact/cjs')
const staticLocationHook = require('wouter-preact/cjs/static-location')

const manifest = require('./dist/manifest.json')

module.exports = (request, reply) => {
  // Just return empty html while developing
  if (process.argv.includes('-d')) return reply.type('text/html').send(renderHtml())

  if (request.raw.url.startsWith('/dist/')) {
    const target = request.raw.url.split('/')[2]
    const file = require("path").join(__dirname, '..', 'dist', target)
    if (existsSync(file) && target && target !== '.' && target !== '..') {
      reply.header('content-type', mime.lookup(file) || 'application/octet-stream')
      return reply.send(createReadStream(file))
    }
  }

  // SSR
  const App = require('./dist/App').default
  const hook = staticLocationHook(request.raw.url, { record: true })

  const html = renderToString(
    h(Router, {
      hook
    }, h(App, { server: true }))
  )

  const finalPage = hook.history.slice(-1)[0];

  if (finalPage != request.raw.url) {
    // Redirect
    reply.raw.writeHead(302, { location: finalPage })
    reply.raw.end()
  } else {
    // Send
    reply.header('content-type', 'text/html')
    reply.raw.end(renderHtml(html))
  }
}

const renderHtml = (html) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charSet='utf8'>
      <meta httpEquiv='Content-Type' content='text/html; charset=UTF-8'>
      <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover'>
      <meta property='description' content='Muz playing around'>

      <meta property='og:locale' content='tr_TR'>
      <meta property='og:title' content='donutbar'>
      <meta property='og:site_name' content='donutbar'>
      <meta property='og:description' content='Muz playing around'>

      <title>DOOMBAR</title>
      <link href='https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;800&display=swap' rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
      ${manifest['styles.css'] ? `<link rel='stylesheet' href='${manifest['styles.css']}'/>` : ''}
    </head>
    <body>
      <div id='root'>${html || ''}</div>
      <div id='tooltip-container'></div>
      <script>window.GLOBAL_ENV = { PRODUCTION: ${process.argv.includes('-p')} }</script>
      <script src='${manifest['main.js']}'></script>
      ${manifest['styles.js'] ? `<script src='${manifest['styles.js']}'></script>` : ''}
    </body>
  </html>
`