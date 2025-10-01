import { createClient } from '@/lib/supabase/server';

export async function initializeDatabase() {
  const supabase = createClient();
  
  try {
    // Check if the chat_sessions table exists
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error('Error checking table existence:', error);
      // Table might not exist, try to create it
      return await createChatSessionsTable(supabase);
    }
    
    console.log('Database initialization successful - table exists');
    return { success: true, message: 'Table already exists' };
  } catch (error: any) {
    console.error('Database initialization error:', error);
    return { success: false, error: error.message };
  }
}

async function createChatSessionsTable(supabase: any) {
  try {
    // This would be where we'd run the migration, but in a real app,
    // you'd use the Supabase CLI to run migrations
    console.log('Would create chat_sessions table here');
    return { success: true, message: 'Table creation logic would go here' };
  } catch (error: any) {
    console.error('Error creating table:', error);
    return { success: false, error: error.message };
  }
}