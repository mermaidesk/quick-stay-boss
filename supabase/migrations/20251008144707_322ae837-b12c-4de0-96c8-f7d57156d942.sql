-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view tasks for their property" 
ON public.tasks 
FOR SELECT 
USING (property_id IN (SELECT id FROM properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can create tasks for their property" 
ON public.tasks 
FOR INSERT 
WITH CHECK (property_id IN (SELECT id FROM properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can update tasks for their property" 
ON public.tasks 
FOR UPDATE 
USING (property_id IN (SELECT id FROM properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete tasks for their property" 
ON public.tasks 
FOR DELETE 
USING (property_id IN (SELECT id FROM properties WHERE user_id = auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();