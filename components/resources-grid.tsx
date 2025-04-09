"use client"

import { useState, useEffect } from "react"
import { 
  ExternalLink, 
  FileText, 
  Github, 
  Youtube, 
  Book, 
  Code, 
  Search, 
  Star, 
  HeartHandshake,
  BookOpen,
  Bookmark
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// All possible resource categories
const CATEGORIES = [
  "All",
  "Documentation",
  "UI Components",
  "Libraries",
  "Tutorials",
  "Tools"
]

// All possible resource types with icons
const RESOURCE_TYPES = {
  documentation: { icon: FileText, color: "text-blue-500" },
  github: { icon: Github, color: "text-slate-800 dark:text-slate-200" },
  video: { icon: Youtube, color: "text-red-500" },
  tutorial: { icon: Book, color: "text-green-500" },
  code: { icon: Code, color: "text-violet-500" },
  example: { icon: BookOpen, color: "text-amber-500" },
  community: { icon: HeartHandshake, color: "text-pink-500" }
}

export function ResourcesGrid({ className }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [bookmarks, setBookmarks] = useState([])

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("resource-bookmarks")
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks))
    }
  }, [])

  // Save bookmarks to localStorage when they change
  useEffect(() => {
    localStorage.setItem("resource-bookmarks", JSON.stringify(bookmarks))
  }, [bookmarks])

  // Toggle bookmark status
  const toggleBookmark = (title) => {
    setBookmarks(prev => 
      prev.includes(title) 
        ? prev.filter(b => b !== title) 
        : [...prev, title]
    )
  }

  // Enhanced resources with categories and types
  const resources = [
    {
      title: "React Documentation",
      description: "Official React documentation with guides, API references, and interactive examples",
      link: "https://react.dev",
      type: "documentation",
      categories: ["Documentation"],
      tags: ["React", "Documentation", "Official"],
      popularity: 5
    },
    {
      title: "Next.js Documentation",
      description: "Learn about Next.js features, API reference, and deployment options",
      link: "https://nextjs.org/docs",
      type: "documentation",
      categories: ["Documentation"],
      tags: ["Next.js", "Documentation", "SSR"],
      popularity: 5
    },
    {
      title: "Tailwind CSS",
      description: "A utility-first CSS framework for rapidly building custom user interfaces",
      link: "https://tailwindcss.com",
      type: "documentation",
      categories: ["Documentation", "UI Components"],
      tags: ["CSS", "Styling", "Utility-first"],
      popularity: 5
    },
    {
      title: "shadcn/ui",
      description: "Beautifully designed components built with Radix UI and Tailwind CSS",
      link: "https://ui.shadcn.com",
      type: "github",
      categories: ["UI Components", "Libraries"],
      tags: ["Components", "UI", "Accessible"],
      popularity: 4
    },
    {
      title: "React Flow",
      description: "Library for building node-based editors, diagrams and interactive flowcharts",
      link: "https://reactflow.dev",
      type: "github",
      categories: ["Libraries"],
      tags: ["Flow Charts", "Diagrams", "Interactive"],
      popularity: 4
    },
    {
      title: "Epic React by Kent C. Dodds",
      description: "Comprehensive React training courses with practical examples",
      link: "https://epicreact.dev/",
      type: "tutorial",
      categories: ["Tutorials"],
      tags: ["React", "Workshop", "Advanced"],
      popularity: 4
    },
    {
      title: "React DevTools",
      description: "Browser extension for debugging React applications",
      link: "https://react.dev/learn/react-developer-tools",
      type: "code",
      categories: ["Tools"],
      tags: ["Debugging", "Development", "Tools"],
      popularity: 3
    },
    {
      title: "React Hook Form",
      description: "Performant, flexible and extensible forms with easy-to-use validation",
      link: "https://react-hook-form.com/",
      type: "github",
      categories: ["Libraries"],
      tags: ["Forms", "Validation", "Hooks"],
      popularity: 4
    },
    {
      title: "React Query Tutorial",
      description: "Learn how to fetch, cache and update data in React applications",
      link: "https://youtube.com/playlist?list=PLC3y8-rFHvwjTELCrPrcZlo6blLBUspd2",
      type: "video",
      categories: ["Tutorials"],
      tags: ["Data Fetching", "State Management", "Video"],
      popularity: 3
    },
    {
      title: "Framer Motion",
      description: "Production-ready animation library for React applications",
      link: "https://www.framer.com/motion/",
      type: "documentation",
      categories: ["Libraries"],
      tags: ["Animation", "Transitions", "Interactive"],
      popularity: 4
    },
    {
      title: "React Patterns",
      description: "Common design patterns and component structures for React",
      link: "https://reactpatterns.com/",
      type: "example",
      categories: ["Documentation"],
      tags: ["Patterns", "Best Practices", "Code Examples"],
      popularity: 3
    },
    {
      title: "React Community Discord",
      description: "Join the React community to ask questions and share knowledge",
      link: "https://www.reactiflux.com/",
      type: "community",
      categories: ["Community"],
      tags: ["Community", "Support", "Discussion"],
      popularity: 3
    }
  ]

  // Filter resources based on search term and selected category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchTerm === "" || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = activeCategory === "All" || 
      resource.categories.includes(activeCategory)

    return matchesSearch && matchesCategory
  })

  // Sort resources by popularity and bookmarked status
  const sortedResources = [...filteredResources].sort((a, b) => {
    // First sort by bookmark status
    const aBookmarked = bookmarks.includes(a.title) ? 1 : 0
    const bBookmarked = bookmarks.includes(b.title) ? 1 : 0
    
    if (aBookmarked !== bBookmarked) {
      return bBookmarked - aBookmarked // Bookmarked items first
    }
    
    // Then sort by popularity
    return b.popularity - a.popularity
  })

  // Get appropriate icon and color for resource type
  const getResourceTypeInfo = (type) => {
    return RESOURCE_TYPES[type] || RESOURCE_TYPES.documentation
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Tabs 
          value={activeCategory} 
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
            {CATEGORIES.map(category => (
              <TabsTrigger 
                key={category} 
                value={category} 
                className="text-xs md:text-sm"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {sortedResources.length} resources
        {activeCategory !== "All" && ` in ${activeCategory}`}
        {searchTerm && ` matching "${searchTerm}"`}
      </div>
      
      {/* Resources Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedResources.map((resource) => {
          const { icon: Icon, color } = getResourceTypeInfo(resource.type)
          const isBookmarked = bookmarks.includes(resource.title)
          
          return (
            <Card 
              key={resource.title}
              className={cn(
                "transition-all duration-200 hover:shadow-md",
                isBookmarked && "ring-2 ring-yellow-200 dark:ring-yellow-800"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={cn("h-5 w-5", color)} />
                    {[...Array(resource.popularity)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={(e) => {
                              e.preventDefault()
                              toggleBookmark(resource.title)
                            }}
                          >
                            <Bookmark 
                              className={cn(
                                "h-4 w-4", 
                                isBookmarked ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              )} 
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isBookmarked ? "Remove bookmark" : "Add bookmark"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{resource.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <CardTitle className="mt-2 text-lg">{resource.title}</CardTitle>
                <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <a href={resource.link} target="_blank" rel="noopener noreferrer">
                    Visit Resource
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
      
      {/* Empty State */}
      {sortedResources.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No resources found</h3>
          <p className="text-muted-foreground max-w-md mt-2">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchTerm("")
              setActiveCategory("All")
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}