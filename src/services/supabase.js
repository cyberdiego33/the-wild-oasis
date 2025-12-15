import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://kfozxafslhzhdihdnswx.supabase.co";
// const supabaseKey = process.env.SUPABASE_KEY;
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmb3p4YWZzbGh6aGRpaGRuc3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODY2MTksImV4cCI6MjA4MDc2MjYxOX0.lqbtaH0454Sv9S0IYV-qV2XGBl-_qeWU2M8OX-jDP7Q";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
