const { createClient } = require('@supabase/supabase-js');
const zonesData = require('../public/data/zones.json');

const supabaseUrl = 'https://ihbcivtxochirpnpcmyv.supabase.co';
const supabaseKey = 'sb_publishable_eBNFI44ApD2qULfKuXShqQ_6TU3Ie2T';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateZones() {
    console.log('🚀 Iniciando migración de zonas a Supabase...');
    console.log(`📊 Total de zonas a migrar: ${zonesData.length}`);

    try {
        const { data, error } = await supabase
            .from('zones')
            .insert(zonesData)
            .select();

        if (error) {
            console.error('❌ Error:', error.message);
            throw error;
        }

        console.log(`✅ Migración exitosa! ${data?.length || 0} zonas insertadas`);

        const { data: stats } = await supabase
            .from('zones')
            .select('status');

        if (stats) {
            const available = stats.filter(z => z.status === 'available').length;
            const occupied = stats.filter(z => z.status === 'occupied').length;

            console.log('\n📊 Estadísticas:');
            console.log(`   Total: ${stats.length}`);
            console.log(`   Disponibles: ${available}`);
            console.log(`   Ocupadas: ${occupied}`);
        }

    } catch (error) {
        console.error('💥 Error:', error.message);
        process.exit(1);
    }
}

migrateZones()
    .then(() => {
        console.log('\n✨ Migración completada!');
        process.exit(0);
    });
