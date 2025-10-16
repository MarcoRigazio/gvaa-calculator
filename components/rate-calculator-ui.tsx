import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react"; // A nice icon for the tip

export function RateCalculatorUI() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            VO Rate Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* --- Input Section --- */}
            <div className="grid gap-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                // FIXED: Replaced single quotes with &apos;
                placeholder="e.g., &apos;Regional TV Commercial&apos;"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budget">Client&apos;s Budget ($)</Label>
              <Input id="budget" type="number" placeholder="e.g., 1500" />
            </div>

            {/* --- Informational Alert --- */}
            <Alert className="border-yellow-500/50 text-yellow-700 dark:border-yellow-500/60 dark:text-yellow-300 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Pro Tip</AlertTitle>
              <AlertDescription>
                Upgrade to save your quote history and access pro negotiation
                templates!
              </AlertDescription>
            </Alert>

            {/* --- Results Section (Placeholder) --- */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <h3 className="font-semibold mb-2">Calculated Rate:</h3>
              <p className="text-3xl font-bold">$2,500.00</p>
              {/* FIXED: Replaced apostrophe in client's with &apos; */}
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                This is 167% of the client&apos;s budget.
              </p>
            </div>

            {/* --- Action Buttons --- */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Calculate Quote
              </Button>
              <Button variant="outline" className="w-full">
                Clear Fields
              </Button>
            </div>

            {/* --- Premium Feature Teaser --- */}
            <div className="text-center">
              <Button variant="link" className="text-blue-600 dark:text-blue-400">
                Upgrade to Generate Pro Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
