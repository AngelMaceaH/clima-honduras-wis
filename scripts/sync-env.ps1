# Copia .env -> groq.env en la raíz del proyecto.
# Los servidores estáticos suelen NO servir /.env (404); groq.env sí se puede cargar con fetch.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root '.env'
$dst = Join-Path $root 'groq.env'
if (-not (Test-Path -LiteralPath $src)) {
  Write-Error "No existe $src. Crea el archivo .env con chatbot_api_key=... o GROQ_API_KEY=..."
}
Copy-Item -LiteralPath $src -Destination $dst -Force
Write-Host "OK: $dst actualizado desde .env"
