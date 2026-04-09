import { createClient } from '@supabase/supabase-js';

// 这里使用占位符，实际使用时需要替换为真实的 Supabase 项目配置
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
