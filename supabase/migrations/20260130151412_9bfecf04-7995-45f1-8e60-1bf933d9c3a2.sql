-- Add length constraints to prevent database bloat and enforce data quality

-- Business inputs constraints
ALTER TABLE public.business_inputs 
  ADD CONSTRAINT goals_length_check CHECK (length(goals) <= 5000),
  ADD CONSTRAINT location_length_check CHECK (length(location) <= 200),
  ADD CONSTRAINT business_interest_length_check CHECK (length(business_interest) <= 100),
  ADD CONSTRAINT budget_length_check CHECK (length(budget) <= 50);

-- Communication evaluation constraints  
ALTER TABLE public.communication_evaluation
  ADD CONSTRAINT input_text_length_check CHECK (length(input_text) <= 10000),
  ADD CONSTRAINT feedback_length_check CHECK (length(feedback) <= 2000);

-- Profiles constraints
ALTER TABLE public.profiles
  ADD CONSTRAINT name_length_check CHECK (length(name) <= 100 AND length(name) >= 1);