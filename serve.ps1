$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$prefix = "http://localhost:8080/"

$mimeTypes = @{
  ".css" = "text/css"
  ".html" = "text/html"
  ".js" = "application/javascript"
  ".json" = "application/json"
  ".mjs" = "application/javascript"
  ".png" = "image/png"
  ".svg" = "image/svg+xml"
  ".txt" = "text/plain"
  ".wasm" = "application/wasm"
}

function Get-ContentType([string]$path) {
  $extension = [System.IO.Path]::GetExtension($path).ToLowerInvariant()
  if ($mimeTypes.ContainsKey($extension)) { return $mimeTypes[$extension] }
  return "application/octet-stream"
}

function Resolve-RequestPath([string]$rawPath) {
  $path = [Uri]::UnescapeDataString($rawPath.Split("?")[0])
  if ([string]::IsNullOrWhiteSpace($path) -or $path -eq "/") { $path = "/index.html" }
  $candidate = Join-Path $root $path.TrimStart("/").Replace("/", "\")
  return [System.IO.Path]::GetFullPath($candidate)
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)
$listener.Start()

Write-Host "Lunar is live at $prefix"
Write-Host "Press Ctrl+C to stop."
Start-Process $prefix | Out-Null

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $requestPath = Resolve-RequestPath $context.Request.RawUrl

    if (-not $requestPath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
      $context.Response.StatusCode = 403
      $context.Response.Close()
      continue
    }

    if (-not (Test-Path -LiteralPath $requestPath -PathType Leaf)) {
      $context.Response.StatusCode = 404
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not found")
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
      $context.Response.Close()
      continue
    }

    $fileBytes = [System.IO.File]::ReadAllBytes($requestPath)
    $context.Response.ContentType = Get-ContentType $requestPath
    $context.Response.ContentLength64 = $fileBytes.LongLength
    $context.Response.AddHeader("Cache-Control", "no-cache")
    $context.Response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
    $context.Response.Close()
  }
}
finally {
  $listener.Stop()
  $listener.Close()
}
