const { createClient } = supabase;

const supabaseUrl = "https://clnlqfvnjnrtkmsftuaz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbmxxZnZuam5ydGttc2Z0dWF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NDYyNTIsImV4cCI6MjA2ODQyMjI1Mn0.gBSqzGW_UStDZ4cmfsjq9ZKh4-MTd72KG5UKvISrN9I";
const supabaseClient = createClient(supabaseUrl, supabaseKey);
