const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ihbcivtxochirpnpcmyv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloYmNpdnR4b2NoaXJwbnBjbXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NzcwNjIsImV4cCI6MjA4NTM1MzA2Mn0.o74N3yAbgCrKfryOc4Kl-3S4vPb7ZpRQ2myI2va7mY0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getOrg() {
    const { data, error } = await supabase.from('organizations').select('id, name').limit(1);
    if (error) {
        console.error('Error:', error);
    } else {
        console.log(data[0].id);
    }
}

getOrg();
