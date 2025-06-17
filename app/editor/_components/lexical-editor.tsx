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
      // Grammarly-like styling
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
          min-height: 500px;
        }

        .lexical-editor-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .lexical-content-editable {
          min-height: 500px;
          padding: 2rem;
          font-family: "Georgia", "Times New Roman", serif;
          font-size: 16px;
          line-height: 1.6;
          color: #1f2937;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          caret-color: #9333ea;
          overflow-wrap: break-word;
          word-wrap: break-word;
          hyphens: auto;
        }

        .lexical-content-editable:focus {
          outline: none;
          box-shadow: none;
        }

        .lexical-placeholder {
          position: absolute;
          top: 2rem;
          left: 2rem;
          font-family: "Georgia", "Times New Roman", serif;
          font-size: 16px;
          color: #9ca3af;
          pointer-events: none;
          user-select: none;
        }

        .lexical-paragraph {
          margin: 0 0 1rem 0;
        }

        .lexical-text-bold {
          font-weight: bold;
        }

        .lexical-text-italic {
          font-style: italic;
        }

        .lexical-text-underline {
          text-decoration: underline;
        }

        /* Grammarly-like suggestion styling */
        .lexical-suggestion-underline {
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
        }

        .lexical-suggestion-underline:hover {
          background-color: rgba(220, 38, 38, 0.1);
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .lexical-content-editable {
            padding: 1rem;
            font-size: 14px;
          }

          .lexical-placeholder {
            top: 1rem;
            left: 1rem;
            font-size: 14px;
          }
        }

        /* Focus states for accessibility */
        .lexical-content-editable:focus-visible {
          outline: 2px solid #9333ea;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
