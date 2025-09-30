-- Create properties table (one property per user)
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_name TEXT NOT NULL,
  property_address TEXT,
  google_sheets_id TEXT,
  google_calendar_id TEXT,
  google_form_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  expense_date DATE NOT NULL,
  vendor TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  receipt_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create income table
CREATE TABLE public.income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  guest_name TEXT,
  source TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  nights INTEGER NOT NULL,
  gross_income DECIMAL(10,2) NOT NULL,
  fees DECIMAL(10,2) DEFAULT 0,
  net_income DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create maintenance_log table
CREATE TABLE public.maintenance_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  date_reported DATE NOT NULL,
  issue_description TEXT NOT NULL,
  assigned_to TEXT,
  status TEXT NOT NULL DEFAULT 'Open',
  completion_date DATE,
  cost DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create regulation_log table
CREATE TABLE public.regulation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  issuing_authority TEXT NOT NULL,
  renewal_date DATE,
  status TEXT NOT NULL DEFAULT 'Active',
  file_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create contacts table
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  source TEXT,
  total_revenue DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create documentation table
CREATE TABLE public.documentation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties
CREATE POLICY "Users can view their own property"
  ON public.properties FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own property"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own property"
  ON public.properties FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for expenses
CREATE POLICY "Users can view expenses for their property"
  ON public.expenses FOR SELECT
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can create expenses for their property"
  ON public.expenses FOR INSERT
  WITH CHECK (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can update expenses for their property"
  ON public.expenses FOR UPDATE
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete expenses for their property"
  ON public.expenses FOR DELETE
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

-- RLS Policies for income
CREATE POLICY "Users can view income for their property"
  ON public.income FOR SELECT
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can create income for their property"
  ON public.income FOR INSERT
  WITH CHECK (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can update income for their property"
  ON public.income FOR UPDATE
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete income for their property"
  ON public.income FOR DELETE
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

-- RLS Policies for maintenance_log
CREATE POLICY "Users can view maintenance for their property"
  ON public.maintenance_log FOR SELECT
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can create maintenance for their property"
  ON public.maintenance_log FOR INSERT
  WITH CHECK (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can update maintenance for their property"
  ON public.maintenance_log FOR UPDATE
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete maintenance for their property"
  ON public.maintenance_log FOR DELETE
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

-- RLS Policies for regulation_log
CREATE POLICY "Users can view regulations for their property"
  ON public.regulation_log FOR SELECT
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can create regulations for their property"
  ON public.regulation_log FOR INSERT
  WITH CHECK (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can update regulations for their property"
  ON public.regulation_log FOR UPDATE
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete regulations for their property"
  ON public.regulation_log FOR DELETE
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

-- RLS Policies for contacts
CREATE POLICY "Users can view contacts for their property"
  ON public.contacts FOR SELECT
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can create contacts for their property"
  ON public.contacts FOR INSERT
  WITH CHECK (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can update contacts for their property"
  ON public.contacts FOR UPDATE
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete contacts for their property"
  ON public.contacts FOR DELETE
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

-- RLS Policies for bookings
CREATE POLICY "Users can view bookings for their property"
  ON public.bookings FOR SELECT
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can create bookings for their property"
  ON public.bookings FOR INSERT
  WITH CHECK (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can update bookings for their property"
  ON public.bookings FOR UPDATE
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete bookings for their property"
  ON public.bookings FOR DELETE
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

-- RLS Policies for documentation
CREATE POLICY "Users can view documentation for their property"
  ON public.documentation FOR SELECT
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can create documentation for their property"
  ON public.documentation FOR INSERT
  WITH CHECK (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can update documentation for their property"
  ON public.documentation FOR UPDATE
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete documentation for their property"
  ON public.documentation FOR DELETE
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_income_updated_at BEFORE UPDATE ON public.income
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_log_updated_at BEFORE UPDATE ON public.maintenance_log
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regulation_log_updated_at BEFORE UPDATE ON public.regulation_log
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documentation_updated_at BEFORE UPDATE ON public.documentation
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();