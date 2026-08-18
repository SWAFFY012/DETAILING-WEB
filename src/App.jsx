import { Fragment, useEffect, useMemo } from "react"
import parse, { domToReact } from "html-react-parser"
import rawPage from "../legacy-index.html?raw"
import { Button } from "@/components/ui/button"

function bodyMarkup(source) {
  const start = source.indexOf("<body>")
  const end = source.lastIndexOf("</body>")
  return source.slice(start + 6, end).replace(/<script[\s\S]*?<\/script>/gi, "")
}

export default function App() {
  const content = useMemo(() => parse(bodyMarkup(rawPage), {
    replace(node) {
      const classes = node.attribs?.class?.split(" ") ?? []
      const remove =
        classes.includes("hero__eyebrow") ||
        classes.includes("hero__subtitle") ||
        classes.includes("section__eyebrow") ||
        classes.includes("form__total") ||
        (node.name === "small" && node.parent?.attribs?.class?.includes("logo__text"))

      if (remove) return <Fragment />

      if (node.type === "tag" && node.name === "button" && node.attribs?.id === "cookieAccept") {
        const { class: className, ...attrs } = node.attribs
        return <Button {...attrs} className={className}>{domToReact(node.children)}</Button>
      }
    },
  }), [])

  useEffect(() => {
    import("../js/main__5f8b97.js")
  }, [])

  useEffect(() => {
    const gallery = document.querySelector("#gallery")
    const tracks = [
      document.querySelector("#worksRow1"),
      document.querySelector("#worksRow2"),
    ].filter(Boolean)
    if (!gallery || tracks.length === 0) return undefined

    const originals = tracks.map((track) => [...track.children])
    originals.forEach((items, index) => {
      const fragment = document.createDocumentFragment()
      for (let copy = 0; copy < 2; copy += 1) {
        items.forEach((item) => {
          const clone = item.cloneNode(true)
          clone.setAttribute("aria-hidden", "true")
          clone.querySelectorAll("img").forEach((image) => {
            image.alt = ""
            image.loading = "lazy"
          })
          fragment.appendChild(clone)
        })
      }
      tracks[index].appendChild(fragment)
    })

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let sectionTop = 0
    let loopWidths = []
    let frameRequested = false

    const measure = () => {
      sectionTop = window.scrollY + gallery.getBoundingClientRect().top
      loopWidths = tracks.map((track, index) =>
        originals[index].reduce((sum, item) => sum + item.getBoundingClientRect().width, 0) +
        Math.max(0, originals[index].length - 1) * 16,
      )
    }

    const update = () => {
      const offset = reducedMotion.matches
        ? 200
        : (window.scrollY - sectionTop + window.innerHeight) * 0.3
      const movement = offset - 200
      tracks.forEach((track, index) => {
        const direction = index === 0 ? 1 : -1
        track.style.transform = `translate3d(${-loopWidths[index] + movement * direction}px, 0, 0)`
      })
      frameRequested = false
    }

    const requestUpdate = () => {
      if (frameRequested) return
      frameRequested = true
      window.requestAnimationFrame(update)
    }

    const refresh = () => {
      measure()
      requestUpdate()
    }

    refresh()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", refresh)
    reducedMotion.addEventListener?.("change", requestUpdate)

    return () => {
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", refresh)
      reducedMotion.removeEventListener?.("change", requestUpdate)
      tracks.forEach((track, index) => {
        track.replaceChildren(...originals[index])
        track.style.transform = ""
      })
    }
  }, [])

  return content
}
