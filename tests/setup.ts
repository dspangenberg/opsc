/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import '@testing-library/jest-dom'

if (typeof globalThis.DOMMatrix === 'undefined') {
  class DOMMatrix {
    a = 1
    b = 0
    c = 0
    d = 1
    e = 0
    f = 0
    is2D = true
    isIdentity = true
    m11 = 1
    m12 = 0
    m13 = 0
    m14 = 0
    m21 = 0
    m22 = 1
    m23 = 0
    m24 = 0
    m31 = 0
    m32 = 0
    m33 = 1
    m34 = 0
    m41 = 0
    m42 = 0
    m43 = 0
    m44 = 1
    constructor(init?: string) {
      if (init) {
        const values = init.split(',').map(Number)
        this.a = values[0] ?? 1
        this.b = values[1] ?? 0
        this.c = values[2] ?? 0
        this.d = values[3] ?? 1
        this.e = values[4] ?? 0
        this.f = values[5] ?? 0
      }
    }
    multiply(): DOMMatrix {
      return new DOMMatrix()
    }
    translate(): DOMMatrix {
      return new DOMMatrix()
    }
    scale(): DOMMatrix {
      return new DOMMatrix()
    }
  }
  globalThis.DOMMatrix = DOMMatrix as unknown as typeof globalThis.DOMMatrix
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  type IOCallback = (entries: IntersectionObserverEntry[], instance: IntersectionObserver) => void

  class IntersectionObserver {
    static instances: IntersectionObserver[] = []
    readonly root: Element | Document | null
    readonly rootMargin: string
    readonly thresholds: ReadonlyArray<number>
    private readonly callback: IOCallback
    private readonly targets = new Set<Element>()

    constructor(callback: IOCallback, options?: IntersectionObserverInit) {
      this.callback = callback
      this.root = options?.root ?? null
      this.rootMargin = options?.rootMargin ?? '0px'

      const thresholds = Array.isArray(options?.thresholds) ? options.thresholds : [options?.thresholds ?? 0]
      this.thresholds = thresholds.map(threshold => Math.min(Math.max(threshold, 0), 1))

      IntersectionObserver.instances.push(this)
    }

    observe(target: Element): void {
      this.targets.add(target)
    }
    unobserve(target: Element): void {
      this.targets.delete(target)
    }
    disconnect(): void {
      this.targets.clear()
    }
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }

    trigger(): void {
      const entries = Array.from(this.targets).map(target => ({
        isIntersecting: true,
        target,
        intersectionRatio: 1,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: 0,
        isVisible: true
      }))
      this.callback(entries, this)
    }
  }
  globalThis.IntersectionObserver = IntersectionObserver as unknown as typeof globalThis.IntersectionObserver
}
