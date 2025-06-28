import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, Mic, Play, Download, Heart, User, Volume2, AudioWaveformIcon as Waveform } from "lucide-react"
import Link from "next/link"

export default function VoiceClonePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">VoiceCare AI</span>
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/patients" className="text-gray-600 hover:text-gray-900">
              Patients
            </Link>
            <Link href="/analytics" className="text-gray-600 hover:text-gray-900">
              Analytics
            </Link>
            <Link href="/calls" className="text-gray-600 hover:text-gray-900">
              Call Logs
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Cloning Studio</h1>
          <p className="text-gray-600">
            Create personalized voice clones using Murf AI technology for medication reminders
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Voice Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mic className="w-5 h-5 mr-2" />
                  Upload Voice Sample
                </CardTitle>
                <CardDescription>
                  Upload a clear audio recording of the loved one's voice (minimum 30 seconds recommended)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Patient Selection */}
                <div className="space-y-2">
                  <Label htmlFor="patient">Select Patient</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose patient for voice clone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-smith">John Smith</SelectItem>
                      <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="mike-davis">Mike Davis</SelectItem>
                      <SelectItem value="emma-wilson">Emma Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Voice Relationship */}
                <div className="space-y-2">
                  <Label htmlFor="relationship">Voice Relationship</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Who's voice is this?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Close Friend</SelectItem>
                      <SelectItem value="caregiver">Caregiver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Audio File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Drop your audio file here</p>
                    <p className="text-gray-600 mb-4">or click to browse</p>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Supported formats: MP3, WAV, M4A (Max 50MB)</p>
                  </div>
                </div>

                {/* Voice Sample Text */}
                <div className="space-y-2">
                  <Label htmlFor="sample-text">Sample Text (Optional)</Label>
                  <Textarea
                    id="sample-text"
                    placeholder="Enter the text that was spoken in the audio file to improve accuracy..."
                    className="min-h-24"
                  />
                  <p className="text-xs text-gray-500">Providing the transcript helps improve voice cloning accuracy</p>
                </div>

                <Button className="w-full" size="lg">
                  <Waveform className="w-5 h-5 mr-2" />
                  Start Voice Cloning Process
                </Button>
              </CardContent>
            </Card>

            {/* Processing Status */}
            <Card>
              <CardHeader>
                <CardTitle>Processing Status</CardTitle>
                <CardDescription>Voice cloning progress and status updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Audio Analysis</span>
                    <Badge variant="default">Completed</Badge>
                  </div>
                  <Progress value={100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Voice Training</span>
                    <Badge variant="default">In Progress</Badge>
                  </div>
                  <Progress value={65} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Quality Validation</span>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <Progress value={0} className="h-2" />

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Estimated completion:</strong> 5-10 minutes
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      You'll receive an email notification when the voice clone is ready
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Existing Voice Clones */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Existing Voice Clones</CardTitle>
                <CardDescription>Manage and test your created voice clones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium">Mary Smith</span>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">John Smith's Spouse</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="w-3 h-3 mr-1" />
                        Test
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium">Mike Johnson</span>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Sarah Johnson's Son</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="w-3 h-3 mr-1" />
                        Test
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg opacity-60">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium">Lisa Davis</span>
                      </div>
                      <Badge variant="secondary">Processing</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Mike Davis's Daughter</p>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voice Testing */}
            <Card>
              <CardHeader>
                <CardTitle>Voice Testing</CardTitle>
                <CardDescription>Test your voice clones with sample medication reminders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Voice Clone</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose voice to test" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mary-smith">Mary Smith (John's Spouse)</SelectItem>
                      <SelectItem value="mike-johnson">Mike Johnson (Sarah's Son)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Test Message</Label>
                  <Textarea
                    placeholder="Hi John, it's time to take your Lisinopril. How are you feeling today?"
                    className="min-h-20"
                  />
                </div>

                <Button className="w-full">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Generate & Play Test
                </Button>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Test Audio</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips & Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Voice Cloning Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <p>Use clear, high-quality audio recordings without background noise</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <p>Minimum 30 seconds of speech for basic cloning, 2+ minutes for best results</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <p>Include varied speech patterns and emotions in the sample</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <p>Always obtain proper consent before cloning someone's voice</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
