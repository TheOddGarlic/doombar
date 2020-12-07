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

import { useEffect, useState, useRef } from 'preact/hooks'

import style from '@styles/memberCount.scss'

function MemberCount ({ className, invite }) {
  let [memberCount, setMemberCount] = useState(0)
  let [onlineCount, setOnlineCount] = useState(0)
  let ignore = useRef()

  useEffect(() => {
    if (!ignore.current) {
      var xhr = new XMLHttpRequest()
      xhr.open("GET", `https://discord.com/api/v8/invites/${invite}?with_counts=true`, true)
      xhr.onload = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            setMemberCount(JSON.parse(xhr.responseText).approximate_member_count)
            setOnlineCount(JSON.parse(xhr.responseText).approximate_presence_count)
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
  }, [memberCount, onlineCount])

  return (
    <div class={[style.countContainer, className ].filter(Boolean).join(' ')}>
      <span><div class={`${style.status} ${style.statusOnline}`}>x</div>{ onlineCount } Online</span>
      <span><div class={style.status}>x</div>{ memberCount } Members</span>
    </div>
  )
}

export default MemberCount