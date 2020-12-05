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

// Node
import fastify from 'fastify';
import fastifyCompress from 'fastify-compress';
import { createReadStream } from 'fs'
import { join } from 'path'

import motds from '../http-src/motds.json'
import react from './react';

const fast = fastify({ logger: true })

fast.register(fastifyCompress)

// Robots Exclusion Protocol
fast.get('/robots.txt', (_, reply) => reply.type('text/plain').send(createReadStream(join(__dirname, '../http-src/robots.txt'))))

// Random MOTD Protocol
fast.get('/motd', (_, reply) => reply.type('text/plain').send(motds[~~(Math.random() * motds.length)]))

// Never Giving Up Protocol
fast.get('/2bit', (_, reply) => reply.redirect(303, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'))

// React
fast.get('*', react)

fast.ready()
  .then(() => fast.listen(process.env.PORT || 6969, '0.0.0.0'))
  .catch(e => fast.log.error(e) && process.exit(1))