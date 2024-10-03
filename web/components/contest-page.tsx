"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2, AlertTriangle, Clock, X, Flag } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import confetti from 'canvas-confetti'

interface Question {
  id: string
  name: string
  content: string
  points: number
  timeLimit: number
  attempts: number
  testResults: TestResult[]
  status: 'not_tried' | 'pending' | 'active' | 'failed' | 'success'
}

interface TestResult {
  id: string
  name: string
  status: "compile_error" | "fail" | "pass"
  description: string
  details: string
}

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
]

export function ContestPageComponent() {
  const { id } = useParams<{ id: string }>()
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      name: "FizzBuzz",
      content: "Implement the classic FizzBuzz problem.",
      points: 10,
      timeLimit: 60,
      attempts: 2,
      status: 'not_tried',
      testResults: [
        {
          id: "1",
          name: "Test 1",
          status: "pass",
          description: "Basic FizzBuzz test",
          details: "Input: [1, 2, 3, 4, 5]\nExpected Output: [1, 2, 'Fizz', 4, 'Buzz']\nActual Output: [1, 2, 'Fizz', 4, 'Buzz']",
        },
        {
          id: "2",
          name: "Test 2",
          status: "fail",
          description: "FizzBuzz up to 15",
          details: "Input: [15]\nExpected Output: ['FizzBuzz']\nActual Output: ['Fizz']\nFailed assertion: assert.deepEqual(fizzBuzz(15), ['FizzBuzz'])",
        },
      ],
    },
    {
      id: "2",
      name: "HTML Structure",
      content: "Create a simple HTML structure with a header, main content, and footer.",
      points: 5,
      timeLimit: 45,
      attempts: 1,
      status: 'not_tried',
      testResults: [
        {
          id: "3",
          name: "Test 1",
          status: "pass",
          description: "Basic HTML structure",
          details: "Expected elements found: <header>, <main>, <footer>",
        },
      ],
    },
    {
      id: "3",
      name: "JavaScript Basics",
      content: "What is the output of console.log(typeof typeof 1)?",
      points: 3,
      timeLimit: 30,
      attempts: 0,
      status: 'not_tried',
      testResults: [
        {
          id: "4",
          name: "Test 1",
          status: "compile_error",
          description: "Syntax check",
          details: "SyntaxError: Unexpected token '}'\n  at line 7, column 1:\n    }\n    ^",
        },
      ],
    },
  ])
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null)
  const [code, setCode] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].value)
  const [expandedTestResult, setExpandedTestResult] = useState<string | null>(null)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [reportProblem, setReportProblem] = useState("")
  const [totalPoints, setTotalPoints] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [queuePosition, setQueuePosition] = useState(0)
  const [startPending, setStartPending] = useState(false)

  const { toast } = useToast()

  const handleQuestionClick = (questionId: string) => {
    if (expandedQuestion === questionId) {
      setExpandedQuestion(null)
    } else {
      setExpandedQuestion(questionId)
    }
  }

  const handleStartQuestion = async (questionId: string) => {
    if(activeQuestion && activeQuestion == questionId) {
      setStartPending(true);
      await stopQuestion(activeQuestion);
      return;
    }
    if (activeQuestion && activeQuestion !== questionId) {
      toast({
        title: "Stop current question?",
        description: "Starting a new question will stop the current one. Do you want to proceed?",
        action: (
          <Button
            variant="destructive"
            onClick={() => {
              setStartPending(true);
              stopQuestion(activeQuestion)
              setStartPending(true);
              startQuestion(questionId)
            }}
          >
            Yes, stop and start new
          </Button>
        ),
      })
    } else {
      setStartPending(true);
      await startQuestion(questionId)
    }
  }

  const stopQuestion = async (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, status: 'pending' } : q
    ))

    toast({
      title: "Stopping question...",
      description: (
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 animate-spin" />
          Stopping question #{questionId}
        </div>
      ),
    })

    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const success = Math.random() > 0.2 // 80% success rate for demonstration
    if (success) {
      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, status: 'failed' } : q
      ))
      setActiveQuestion(null)
      toast({
        title: "Question stopped",
        description: (
          <div className="flex items-center">
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
            Question #{questionId} has been stopped successfully
          </div>
        ),
      })
    } else {
      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, status: 'active' } : q
      ))
      toast({
        title: "Error stopping question",
        description: (
          <div className="flex items-center">
            <X className="mr-2 h-4 w-4 text-red-500" />
            Failed to stop question #{questionId}. Please try again.
          </div>
        ),
        variant: "destructive",
      })
    }
    setStartPending(false);
  }

  const startQuestion = async (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, status: 'pending' } : q
    ))
    toast({
      title: "Starting question...",
      description: (
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 animate-spin" />
          Starting question #{questionId}
        </div>
      ),
    })
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const success = Math.random() > 0.2 // 80% success rate for demonstration
    if (success) {
      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, status: 'active' } : 
        q.status === 'active' ? { ...q, status: 'not_tried' } : q
      ))
      setActiveQuestion(questionId)
      setExpandedQuestion(questionId)
      toast({
        title: "Question started",
        description: `You have started question #${questionId}. Good luck!`,
      })
    } else {
      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, status: 'not_tried' } : q
      ))
      toast({
        title: "Error starting question",
        description: "Failed to start the question. Please try again.",
        variant: "destructive",
      })
    }
    setStartPending(false);
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setQueuePosition(Math.floor(Math.random() * 40) + 10)

    const checkInterval = setInterval(() => {
      setQueuePosition(prev => Math.max(0, prev - 1))
    }, 1000)

    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    clearInterval(checkInterval)

    const success = Math.random() > 0.5 // 50% success rate for demonstration
    if (success) {
      confetti({
        particleCount: 400,
        spread: 140,
        origin: { y: 0.6 }
      })
      const pointsAwarded = questions.find(q => q.id === activeQuestion)?.points || 0
      setTotalPoints(prev => prev + pointsAwarded)
      setQuestions(questions.map(q => 
        q.id === activeQuestion ? { ...q, status: 'success' } : q
      ))
      toast({
        title: "Solution accepted!",
        description: `Congratulations! You've earned ${pointsAwarded} points.`,
      })
      setActiveQuestion(null);
    } else {
      setQuestions(questions.map(q => 
        q.id === activeQuestion ? { ...q, status: 'failed' } : q
      ))
      toast({
        title: "Solution rejected",
        description: "Your solution didn't pass all tests. Please try again.",
        variant: "destructive",
      })
    }

    setIsSubmitting(false)
    setIsSubmitDialogOpen(false)
    setActiveQuestion(null)
  }

  const handleReportProblem = () => {
    console.log("Problem reported:", reportProblem)
    setIsReportDialogOpen(false)
    setReportProblem("")
    toast({
      title: "Problem reported",
      description: "Thank you for reporting the problem. We'll look into it.",
    })
  }

  const renderTestResult = (result: TestResult, questionStatus: Question['status']) => {
    const iconProps = { className: "h-5 w-5 text-white" }
    let bgColor = ""
    let Icon = CheckCircle2
    let statusText = ""

    switch (result.status) {
      case "compile_error":
        bgColor = "bg-yellow-500"
        Icon = AlertTriangle
        statusText = "Failed to compile"
        break
      case "fail":
        bgColor = "bg-red-500"
        Icon = AlertCircle
        statusText = "Failed"
        break
      case "pass":
        bgColor = "bg-green-500"
        Icon = CheckCircle2
        statusText = "Succeeded"
        break
    }

    return (
      <div className={cn("flex items-center space-x-2", questionStatus !== 'success' && "opacity-50")}>
        <div className={`${bgColor} p-1 rounded-md`}>
          <Icon {...iconProps} />
        </div>
        <span>{result.name}</span>
        <span className="text-sm text-muted-foreground">{statusText}</span>
      </div>
    )
  }

  const getStatusFlag = (status: Question['status']) => {
    switch (status) {
      case 'not_tried':
        return <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-full">Not Tried</span>
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-full">Pending</span>
      case 'active':
        return <span className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">Active</span>
      case 'failed':
        return <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">Failed</span>
      case 'success':
        return <span className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">Success</span>
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contest: {id}</h1>
      <div className="space-y-4">
        {questions.map((question) => (
          <Card key={question.id}>
            <CardContent className="p-6">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => handleQuestionClick(question.id)}
              >
                <div>
                  <h3 className="text-lg font-semibold">{question.name}</h3>
                  <p className="text-sm text-muted-foreground">Points: {question.points}</p>
                </div>
                <AnimatePresence>
                  <motion.div
                    key={question.status}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {getStatusFlag(question.status)}
                  </motion.div>
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {expandedQuestion === question.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-4">
                      <p>{question.content}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p>Time Limit: {question.timeLimit} minutes</p>
                          <p>Attempts: {question.attempts}</p>
                        </div>
                        <div className="space-x-2">
                          <Button onClick={() => setIsReportDialogOpen(true)}>Report Problem</Button>
                          <Button onClick={() => setIsSubmitDialogOpen(true)} disabled={question.status !== 'active'}>Submit Solution</Button>
                          <Button
                            onClick={() => handleStartQuestion(question.id)}
                            disabled={startPending}
                          >
                            {question.status === 'active' ? "Stop" : "Start"}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Test Results:</h4>
                        <div className="space-y-2">
                          {question.testResults.map((result) => (
                            <div key={result.id} className="flex items-center justify-between">
                              {renderTestResult(result, question.status)}
                              <Button
                                variant="link"
                                onClick={() => setExpandedTestResult(expandedTestResult === result.id ? null : result.id)}
                              >
                                View Details
                              </Button>
                            </div>
                          ))}
                        </div>
                        {expandedTestResult && (
                          <div className="mt-2 p-2 bg-muted rounded-md">
                            <pre className="text-sm whitespace-pre-wrap">
                              {question.testResults.find((r) => r.id === expandedTestResult)?.details}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report a Problem</DialogTitle>
            <DialogDescription>
              Describe the issue you're experiencing with this question.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reportProblem}
            onChange={(e) => setReportProblem(e.target.value)}
            placeholder="Describe the problem here..."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReportProblem}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Submit Solution</DialogTitle>
            <DialogDescription>
              Upload your code file or paste your solution below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Upload Code File</Label>
              <Input id="file-upload" type="file" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code-input">Or Paste Your Code</Label>
              <Textarea
                id="code-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="min-h-[200px] font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language-select">Select Language</Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger id="language-select">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? `Submitting... (Queue position: ${queuePosition})` : 'Submit Solution'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <motion.div
        className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        Total Points: {totalPoints}
      </motion.div>
    </div>
  )
}