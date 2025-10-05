import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckSquare } from "lucide-react";

const Tasks = () => {
  const openGoogleTasks = () => {
    window.open("https://tasks.google.com/", "_blank");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
        <p className="text-muted-foreground mt-1">
          Manage your property tasks and to-dos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Google Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click below to open Google Tasks where you can add, edit, and manage your property-related tasks.
          </p>
          <Button
            onClick={openGoogleTasks}
            className="gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open Google Tasks
          </Button>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Tips for using Google Tasks:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Create separate task lists for different property areas</li>
              <li>Set due dates and reminders for important tasks</li>
              <li>Use subtasks to break down larger projects</li>
              <li>Access your tasks from any device with your Google account</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
