"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

interface ExportGuideProps {
  skillName: string
  slug: string
}

export function ExportGuide({ skillName, slug }: ExportGuideProps) {
  return (
    <Tabs defaultValue="claude-ai" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="claude-ai">Claude.ai</TabsTrigger>
        <TabsTrigger value="claude-code">Claude Code</TabsTrigger>
        <TabsTrigger value="api">Anthropic API</TabsTrigger>
      </TabsList>

      <TabsContent value="claude-ai">
        <Card>
          <CardContent className="p-6 space-y-4 text-sm">
            <h4 className="font-medium">Using {skillName} with Claude.ai</h4>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Download the skill ZIP from this page</li>
              <li>Extract the ZIP and open the <code className="bg-muted px-1.5 py-0.5 rounded text-xs">SKILL.md</code> file</li>
              <li>Copy the entire contents of the SKILL.md file</li>
              <li>Open a new conversation on Claude.ai</li>
              <li>Paste the SKILL.md content as your first message, or add it to a Claude Project as custom instructions</li>
              <li>Claude will now follow the skill&apos;s specialized instructions</li>
            </ol>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="claude-code">
        <Card>
          <CardContent className="p-6 space-y-4 text-sm">
            <h4 className="font-medium">Using {skillName} with Claude Code</h4>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Download the skill ZIP from this page</li>
              <li>Extract the ZIP into your project&apos;s <code className="bg-muted px-1.5 py-0.5 rounded text-xs">Skills/</code> directory:</li>
              <li>
                <code className="block bg-muted px-3 py-2 rounded text-xs mt-1">
                  unzip {slug}.zip -d ~/.claude/skills/{slug}/
                </code>
              </li>
              <li>The skill will be automatically available in Claude Code</li>
              <li>Invoke it by describing a task that matches the skill&apos;s trigger description</li>
            </ol>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="api">
        <Card>
          <CardContent className="p-6 space-y-4 text-sm">
            <h4 className="font-medium">Using {skillName} with the Anthropic API</h4>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Download the skill ZIP and extract the SKILL.md content</li>
              <li>Include the SKILL.md content in the <code className="bg-muted px-1.5 py-0.5 rounded text-xs">system</code> parameter of your API call:</li>
              <li>
                <pre className="block bg-muted px-3 py-2 rounded text-xs mt-1 overflow-x-auto whitespace-pre">
{`{
  "model": "claude-sonnet-4-5-20250929",
  "system": "<paste SKILL.md content here>",
  "messages": [...]
}`}
                </pre>
              </li>
              <li>Claude will follow the skill instructions for all messages in the conversation</li>
            </ol>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
