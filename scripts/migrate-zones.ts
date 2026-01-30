import { supabase } from '../src/lib/supabase';
import zonesData from '../public/data/zones.json';

async function migrateZones() {
    console.log('🚀 Iniciando migración de zonas a Supabase...');
    console.log(`📊 Total de zonas a migrar: ${zonesData.length}`);

    try {
        // Insertar todas las zonas
        const { data, error } = await supabase
            .from('zones')
            .insert(zonesData)
            .select();

        if (error) {
            console.error('❌ Error al migrar zonas:', error);
            throw error;
        }

        console.log(`✅ Migración exitosa! ${data?.length || 0} zonas insertadas`);
        console.log('📋 Zonas migradas:', data);

        // Verificar estadísticas
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
        console.error('💥 Error durante la migración:', error);
        process.exit(1);
    }
}

// Ejecutar migración
migrateZones()
    .then(() => {
        console.log('\n✨ Migración completada exitosamente!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Migración falló:', error);
        process.exit(1);
    });
