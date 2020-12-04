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

import Helmet from 'react-helmet'
import React from 'react'

import Wouter from './Router'
import Header from './Header'
import Footer from './Footer'

import '@styles/app.scss'

function App () {
  return (
    <>
      <Helmet
        titleTemplate='%s • donutbar'
        defaultTitle='donutbar'>
        <meta charSet='utf8'/>
        <meta httpEquiv='Content-Type' content='text/html; charset=UTF-8'/>
        <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover'/>
        <meta property='description' content='Muz playing around'/>

        <meta property='og:locale' content='tr_TR'/>
        <meta property='og:title' content='donutbar'/>
        <meta property='og:site_name' content='donutbar'/>
        <meta property='og:description' content='Muz playing around'/>
        <link href='https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;800&display=swap' rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" />
        <link href='https://cdn.jsdelivr.net/npm/typeface-jetbrains-mono@1.0.5/dist/index.min.css' rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" />
      </Helmet>
      <Header />
      <Wouter />
      <Footer />
    </>
  )
}

App.displayName = 'App'
export default React.memo(App)
