"use strict";

var _fs = require("fs");

var _mimeTypes = _interopRequireDefault(require("mime-types"));

var _react = _interopRequireDefault(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _reactHelmet = _interopRequireDefault(require("react-helmet"));

var _wouter = require("wouter");

var _staticLocation = _interopRequireDefault(require("wouter/static-location"));

var _manifest = _interopRequireDefault(require("./dist/manifest.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
const Helmet = _reactHelmet.default.default;

module.exports = (request, reply) => {
  // Just return empty html while developing
  if (process.argv.includes('-d')) return reply.type('text/html').send(renderHtml());

  if (request.raw.url.startsWith('/dist/')) {
    const target = request.raw.url.split('/')[2];

    const file = require("path").join(__dirname, '..', 'dist', target);

    if ((0, _fs.existsSync)(file) && target && target !== '.' && target !== '..') {
      reply.header('content-type', _mimeTypes.default.lookup(file) || 'application/octet-stream');
      return reply.send((0, _fs.createReadStream)(file));
    }
  } // SSR


  const App = require('./dist/App').default;

  const html = _server.default.renderToString(_react.default.createElement(_wouter.Router, {
    hook: (0, _staticLocation.default)(request.raw.url)
  }, _react.default.createElement(App, {
    server: true
  })));

  if (context.url) {
    // Redirect
    reply.raw.writeHead(302, {
      location: context.url
    });
    reply.raw.end();
  } else {
    // Send
    reply.header('content-type', 'text/html');
    reply.raw.end(renderHtml(Helmet.renderStatic(), html));
  }
};

const renderHtml = (helmet, html) => `
  <!DOCTYPE html>
  <html ${helmet ? helmet.htmlAttributes.toString() : ''}>
    <head>
      <meta charset='utf8'/>
      ${helmet ? helmet.title.toString() : ''}
      ${helmet ? helmet.meta.toString() : ''}
      ${helmet ? helmet.link.toString() : ''}
      ${_manifest.default['styles.css'] ? `<link rel='stylesheet' href='${_manifest.default['styles.css']}'/>` : ''}
    </head>
    <body ${helmet ? helmet.bodyAttributes.toString() : ''}>
      <div id='react-root'>${html || ''}</div>
      <div id='tooltip-container'></div>
      <script>window.GLOBAL_ENV = { PRODUCTION: ${process.argv.includes('-p')} }</script>
      <script src='${_manifest.default['main.js']}'></script>
      ${_manifest.default['styles.js'] ? `<script src='${_manifest.default['styles.js']}'></script>` : ''}
    </body>
  </html>
`;