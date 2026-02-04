# 🚀 Script de Despliegue de Edge Functions de WhatsApp

Write-Host "📦 Desplegando Edge Functions de WhatsApp a Supabase..." -ForegroundColor Cyan

# Verificar que Supabase CLI esté instalado
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Supabase CLI no está instalado." -ForegroundColor Red
    Write-Host "Instálalo con: npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Verificar que estés logueado
Write-Host "`n🔐 Verificando autenticación..." -ForegroundColor Yellow
supabase projects list
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ No estás autenticado en Supabase." -ForegroundColor Red
    Write-Host "Ejecuta: supabase login" -ForegroundColor Yellow
    exit 1
}

# Desplegar whatsapp-inbound
Write-Host "`n📨 Desplegando whatsapp-inbound..." -ForegroundColor Green
supabase functions deploy whatsapp-inbound --no-verify-jwt

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ whatsapp-inbound desplegada correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error desplegando whatsapp-inbound" -ForegroundColor Red
    exit 1
}

# Desplegar whatsapp-outbound
Write-Host "`n📤 Desplegando whatsapp-outbound..." -ForegroundColor Green
supabase functions deploy whatsapp-outbound

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ whatsapp-outbound desplegada correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error desplegando whatsapp-outbound" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 ¡Despliegue completado!" -ForegroundColor Cyan
Write-Host "`n📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Copia la URL de whatsapp-inbound desde Supabase Dashboard" -ForegroundColor White
Write-Host "2. Configúrala como Webhook en Meta Business" -ForegroundColor White
Write-Host "3. Prueba enviando un mensaje de WhatsApp" -ForegroundColor White
