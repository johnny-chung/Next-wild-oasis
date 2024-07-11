import { createClient } from "@supabase/supabase-js";


export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const supabaseUrl =
  "https://sjwfrsvvvkffvfnmggin.supabase.co/storage/v1/s3";
