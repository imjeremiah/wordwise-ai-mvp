"use client"

import { useEffect, useCallback } from "react"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { $getRoot, $getSelection } from "lexical"
import type { EditorState } from "lexical"

interface LexicalEditorProps {
  initialContent?: string
  onContentChange: (content: string, wordCount: number) => void
  placeholder?: string
}

export function LexicalEditor({
  initialContent = "",
  onContentChange,
  placeholder = "Start writing..."
}: LexicalEditorProps) {
  console.log("[LexicalEditor] Component initialized")

  // Editor configuration
  const initialConfig = {
    namespace: "WordWiseEditor",
    theme: {
      // Clean, Grammarly-like styling
      root: "lexical-editor-root",
      paragraph: "lexical-paragraph",
      text: {
        bold: "lexical-text-bold",
        italic: "lexical-text-italic",
        underline: "lexical-text-underline"
      }
    },
    onError: (error: Error) => {
      console.error("[LexicalEditor] Error:", error)
    }
  }

  // Handle editor state changes
  const handleOnChange = useCallback(
    (editorState: EditorState) => {
      console.log("[LexicalEditor] Content changed")

      editorState.read(() => {
        const root = $getRoot()
        const textContent = root.getTextContent()

        // Calculate word count
        const wordCount = textContent
          .trim()
          .split(/\s+/)
          .filter(word => word.length > 0).length

        console.log("[LexicalEditor] Word count:", wordCount)
        onContentChange(textContent, wordCount)
      })
    },
    [onContentChange]
  )

  return (
    <div className="lexical-editor-container">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="lexical-editor-wrapper">
          <PlainTextPlugin
            contentEditable={
              <ContentEditable
                className="lexical-content-editable"
                placeholder={
                  <div className="lexical-placeholder">{placeholder}</div>
                }
                aria-label="Document editor"
                spellCheck={true}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={handleOnChange} />
          <HistoryPlugin />
        </div>
      </LexicalComposer>

      <style jsx global>{`
        .lexical-editor-container {
          width: 100%;
          height: 100%;
          min-height: 600px;
        }

        .lexical-editor-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .lexical-content-editable {
          min-height: 600px;
          padding: 3rem 4rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, sans-serif;
          font-size: 16px;
          line-height: 1.75;
          color: #1f2937;
          background: #ffffff;
          border: none;
          outline: none;
          resize: none;
          caret-color: #16a34a;
          overflow-wrap: break-word;
          word-wrap: break-word;
          letter-spacing: -0.01em;
        }

        .lexical-content-editable:focus {
          outline: none;
          box-shadow: none;
        }

        .lexical-placeholder {
          position: absolute;
          top: 3rem;
          left: 4rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, sans-serif;
          font-size: 16px;
          line-height: 1.75;
          color: #9ca3af;
          pointer-events: none;
          user-select: none;
          letter-spacing: -0.01em;
        }

        .lexical-paragraph {
          margin: 0 0 1.25rem 0;
        }

        .lexical-text-bold {
          font-weight: 600;
        }

        .lexical-text-italic {
          font-style: italic;
        }

        .lexical-text-underline {
          text-decoration: underline;
        }

        /* Grammarly-style suggestion underlines */
        .lexical-suggestion-grammar {
          background-image: linear-gradient(
            to right,
            #dc2626 0%,
            #dc2626 50%,
            transparent 50%,
            transparent 100%
          );
          background-size: 4px 2px;
          background-repeat: repeat-x;
          background-position: bottom;
          cursor: pointer;
          border-radius: 2px;
        }

        .lexical-suggestion-grammar:hover {
          background-color: rgba(220, 38, 38, 0.1);
        }

        .lexical-suggestion-style {
          background-image: linear-gradient(
            to right,
            #2563eb 0%,
            #2563eb 50%,
            transparent 50%,
            transparent 100%
          );
          background-size: 4px 2px;
          background-repeat: repeat-x;
          background-position: bottom;
          cursor: pointer;
          border-radius: 2px;
        }

        .lexical-suggestion-style:hover {
          background-color: rgba(37, 99, 235, 0.1);
        }

        .lexical-suggestion-clarity {
          background-image: linear-gradient(
            to right,
            #7c3aed 0%,
            #7c3aed 50%,
            transparent 50%,
            transparent 100%
          );
          background-size: 4px 2px;
          background-repeat: repeat-x;
          background-position: bottom;
          cursor: pointer;
          border-radius: 2px;
        }

        .lexical-suggestion-clarity:hover {
          background-color: rgba(124, 58, 237, 0.1);
        }

        /* Selection styling */
        .lexical-content-editable::selection {
          background-color: rgba(22, 163, 74, 0.2);
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .lexical-content-editable {
            padding: 2rem 1.5rem;
            font-size: 15px;
            line-height: 1.6;
          }

          .lexical-placeholder {
            top: 2rem;
            left: 1.5rem;
            font-size: 15px;
            line-height: 1.6;
          }

          .lexical-editor-container {
            min-height: 500px;
          }

          .lexical-content-editable {
            min-height: 500px;
          }
        }

        /* Tablet responsiveness */
        @media (max-width: 1024px) and (min-width: 769px) {
          .lexical-content-editable {
            padding: 2.5rem 3rem;
          }

          .lexical-placeholder {
            top: 2.5rem;
            left: 3rem;
          }
        }

        /* Focus states for accessibility */
        .lexical-content-editable:focus-visible {
          outline: 2px solid #16a34a;
          outline-offset: -2px;
        }

        /* Smooth transitions */
        .lexical-content-editable {
          transition: all 0.2s ease-in-out;
        }

        /* Better paragraph spacing for readability */
        .lexical-paragraph:not(:last-child) {
          margin-bottom: 1.25rem;
        }

        .lexical-paragraph:empty {
          margin-bottom: 1.25rem;
        }

        /* Improved list styling when we add list support */
        .lexical-list {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .lexical-listitem {
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  )
}
