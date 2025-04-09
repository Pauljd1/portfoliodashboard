"use client"

import { useEffect, useState } from "react"
import { Check, Copy, Download, FileCode, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

const LANGUAGES = [
  { value: "javascript", label: "JavaScript", extension: "js" },
  { value: "typescript", label: "TypeScript", extension: "ts" },
  { value: "html", label: "HTML", extension: "html" },
  { value: "css", label: "CSS", extension: "css" },
  { value: "python", label: "Python", extension: "py" },
  { value: "jsx", label: "React JSX", extension: "jsx" },
  { value: "tsx", label: "React TSX", extension: "tsx" },
]

interface CodeEditorProps {
  initialCode?: string
  initialTitle?: string
  initialLanguage?: string
  onSave?: (data: { title: string; code: string; language: string }) => void
  readOnly?: boolean
  showLineNumbers?: boolean
  className?: string
}

export function CodeEditor({
  initialCode = `function greeting() {\n  console.log("Hello, world!");\n}\n\ngreeting();`,
  initialTitle = "My Snippet",
  initialLanguage = "javascript",
  onSave,
  readOnly = false,
  showLineNumbers = true,
  className,
}: CodeEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState(initialLanguage)
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const { toast } = useToast()

  // Track if the content has been modified
  useEffect(() => {
    if (code !== initialCode || title !== initialTitle || language !== initialLanguage) {
      setIsDirty(true)
    } else {
      setIsDirty(false)
    }
  }, [code, title, language, initialCode, initialTitle, initialLanguage])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      toast({
        title: "Copied to clipboard",
        description: "Code has been copied to your clipboard.",
        duration: 2000,
      })
    } catch (err) {
      console.error("Failed to copy:", err)
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Call the onSave callback if provided
      if (onSave) {
        await onSave({ title, code, language })
      } else {
        // In a real app, this would save to a database
        console.log("Saving snippet:", { title, code, language })
      }
      
      toast({
        title: "Saved successfully",
        description: `"${title}" has been saved.`,
      })
      
      setIsDirty(false)
    } catch (error) {
      console.error("Error saving:", error)
      toast({
        title: "Save failed",
        description: "An error occurred while saving. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = () => {
    const extension = LANGUAGES.find(lang => lang.value === language)?.extension || language
    const fileName = `${title.replace(/\s+/g, '_').toLowerCase()}.${extension}`
    
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    
    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Downloaded",
      description: `File saved as "${fileName}"`,
    })
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-muted-foreground" />
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="text-lg font-bold h-9" 
              placeholder="Untitled Snippet"
              readOnly={readOnly}
            />
          </CardTitle>
          <Tabs 
            value={language} 
            onValueChange={setLanguage} 
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-4 md:grid-cols-7">
              {LANGUAGES.map((lang) => (
                <TabsTrigger 
                  key={lang.value} 
                  value={lang.value}
                  disabled={readOnly}
                >
                  {lang.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative rounded-md border">
          {showLineNumbers && (
            <div className="absolute top-0 left-0 bottom-0 w-12 bg-muted/50 border-r text-muted-foreground font-mono text-xs text-right overflow-hidden">
              {code.split("\n").map((_, index) => (
                <div key={index} className="py-1 pr-3">
                  {index + 1}
                </div>
              ))}
            </div>
          )}
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={cn(
              "font-mono text-sm min-h-[300px] resize-y",
              showLineNumbers ? "pl-14" : "p-4"
            )}
            style={{ 
              tabSize: 2,
              fontFamily: '"Fira Code", "Menlo", "Monaco", "Courier New", monospace'
            }}
            placeholder="Write or paste your code here..."
            readOnly={readOnly}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between flex-wrap gap-2">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span>{code.split("\n").length} lines</span>
          <span>|</span>
          <span>{code.length} characters</span>
          {isDirty && <span className="text-yellow-500">•&nbsp;Modified</span>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={!isDirty || isSaving || readOnly}
          >
            {isSaving ? (
              <>
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}