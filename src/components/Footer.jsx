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

import { useState, useEffect, useRef } from 'preact/hooks'
import { Link } from 'wouter-preact'

import { Routes } from '@constants'

import style from '@styles/footer.scss'

function Footer () {
  let [motd, setMotd] = useState('')
  let ignore = useRef()

  useEffect(() => {
    if (!ignore.current) {
      var xhr = new XMLHttpRequest()
      xhr.open("GET", "/motd", true)
      xhr.onload = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            setMotd(xhr.responseText)
          } else {
            console.error(xhr.statusText)
          }
        }
      }
      xhr.onerror = function () {
        console.error(xhr.statusText)
      };
      xhr.send(null)

      ignore.current = true;
    }
  }, [motd])

  return (
    <footer className={style.container}>
      <div className={style.section}>
        <span>{ motd ? motd : 'MOTD loading...' }</span>
        <span>Donutbar is not affiliated with Discord. Discord is a trademark of Discord Inc.</span>
      </div>
      <div className={style.section}>
        <span><Link href={Routes.HOME}>Home</Link></span>
        <span><Link href={Routes.ABOUT}>About</Link></span>
        <span><a href={Routes.DISCORD} target='_blank' rel='noreferrer'>Discord Server</a></span>
      </div>
    </footer>
  )
}

export default Footer