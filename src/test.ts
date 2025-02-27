/**
 * Copyright 2021 Vitagroup AG
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import 'jest-preset-angular/setup-jest'
import ResizeObserver from 'resize-observer-polyfill'

Object.defineProperty(window, 'CSS', { value: null })
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    display: 'none',
    appearance: ['-webkit-appearance'],
    getPropertyValue: () => {},
  }),
})

Object.defineProperty(window, 'matchMedia', {
  value: () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
  }),
})

window.ResizeObserver = ResizeObserver

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
})

Object.defineProperty(document.body.style, 'transform', {
  value: () => ({
    enumerable: true,
    configurable: true,
  }),
})

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => null,
})

Object.defineProperty(URL, 'createObjectURL', {
  value: () => 'https://test-link.com',
})
