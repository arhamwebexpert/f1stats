import { useEffect } from 'react'

const SUFFIX = 'F1 Stats Hub'

/**
 * Sets document.title and (optionally) the meta description for the page.
 * Restores nothing on unmount — the next page sets its own.
 */
export function useDocumentTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${SUFFIX}` : SUFFIX
    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }
  }, [title, description])
}
