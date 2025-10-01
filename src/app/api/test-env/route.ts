export async function GET() {
  const hasApiKey = !!process.env.OPENROUTER_API_KEY;
  const hasSiteUrl = !!process.env.NEXT_PUBLIC_SITE_URL;
  const hasSiteName = !!process.env.NEXT_PUBLIC_SITE_NAME;
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Response.json({
    environment: {
      OPENROUTER_API_KEY: hasApiKey ? "SET" : "MISSING",
      NEXT_PUBLIC_SITE_URL: hasSiteUrl ? process.env.NEXT_PUBLIC_SITE_URL : "MISSING",
      NEXT_PUBLIC_SITE_NAME: hasSiteName ? process.env.NEXT_PUBLIC_SITE_NAME : "MISSING",
      NEXT_PUBLIC_SUPABASE_URL: hasSupabaseUrl ? "SET" : "MISSING",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: hasSupabaseKey ? "SET" : "MISSING"
    },
    allRequiredSet: hasApiKey && hasSiteUrl && hasSiteName
  });
}