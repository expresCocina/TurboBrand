// Test script para verificar la respuesta del API de inbox
const fetch = require('node-fetch');

async function testInboxAPI() {
    try {
        console.log('🔍 Testing inbox API...\n');

        // Necesitarás obtener un token válido de Supabase
        // Por ahora, solo probamos la estructura
        const response = await fetch('http://localhost:3000/api/email/inbox', {
            headers: {
                'Authorization': 'Bearer YOUR_TOKEN_HERE'
            }
        });

        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);

        const data = await response.json();

        console.log('\n📊 Response Data:');
        console.log('- Threads count:', data.threads?.length || 0);
        console.log('- Metrics:', JSON.stringify(data.metrics, null, 2));

        if (data.threads && data.threads.length > 0) {
            console.log('\n📧 First thread sample:');
            console.log(JSON.stringify(data.threads[0], null, 2));
        }

        if (data.error) {
            console.log('\n❌ Error:', data.error);
            console.log('Details:', data.details);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testInboxAPI();
