# =============================================
# Hospital Management System - Backend Startup
# =============================================
# Run this script to start the backend server.
# It will prompt you for your PostgreSQL password
# and create the database if it does not exist.
# =============================================

param(
    [string]$PgPassword = "",
    [string]$PgUser = "postgres",
    [string]$PgHost = "localhost",
    [string]$PgPort = "5432",
    [string]$DbName = "hospital_db"
)

# ---- Ask for password if not provided ----
if (-not $PgPassword) {
    $securePass = Read-Host "Enter your PostgreSQL password for user '$PgUser'" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePass)
    $PgPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

$psql = "C:\Program Files\PostgreSQL\15\bin\psql.exe"
$env:PGPASSWORD = $PgPassword

Write-Host "`n[1/3] Testing PostgreSQL connection..." -ForegroundColor Cyan
$test = & $psql -U $PgUser -h $PgHost -p $PgPort -c "SELECT 1;" postgres 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Could not connect to PostgreSQL. Check your password." -ForegroundColor Red
    Write-Host $test
    exit 1
}
Write-Host "  Connected successfully!" -ForegroundColor Green

Write-Host "`n[2/3] Creating database '$DbName' (if not exists)..." -ForegroundColor Cyan
$dbCheck = & $psql -U $PgUser -h $PgHost -p $PgPort -tc "SELECT 1 FROM pg_database WHERE datname='$DbName';" postgres 2>&1
if ($dbCheck -notmatch "1") {
    & $psql -U $PgUser -h $PgHost -p $PgPort -c "CREATE DATABASE $DbName;" postgres
    Write-Host "  Database '$DbName' created!" -ForegroundColor Green
} else {
    Write-Host "  Database '$DbName' already exists. OK." -ForegroundColor Green
}

Write-Host "`n[3/3] Starting Spring Boot backend..." -ForegroundColor Cyan
Write-Host "  Backend will run at: http://localhost:8080`n" -ForegroundColor White

# Pass password as system property so we don't need to edit application.properties
$env:SPRING_DATASOURCE_PASSWORD = $PgPassword
$env:SPRING_DATASOURCE_USERNAME = $PgUser
$env:SPRING_DATASOURCE_URL = "jdbc:postgresql://${PgHost}:${PgPort}/${DbName}"

Set-Location "$PSScriptRoot"
mvn spring-boot:run
