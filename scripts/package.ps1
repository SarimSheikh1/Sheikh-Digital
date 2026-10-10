$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$archivePath = Join-Path ([IO.Path]::GetDirectoryName($projectRoot)) 'SARIM-The-Idea-Universe.zip'
if (Test-Path -LiteralPath $archivePath) { throw 'Archive already exists. Choose a new archive name before packaging.' }
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
$archive = [IO.Compression.ZipFile]::Open($archivePath, [IO.Compression.ZipArchiveMode]::Create)
try {
  $fileList = & rg --files --hidden -g '!node_modules/**' -g '!dist/**' -g '!.capture-cache/**' -g '!.git/**' -g '!repos-raw.json' -g '!qa-*.png' -g '!.env' -g '!.env.local' $projectRoot
  foreach ($file in $fileList) {
    $resolved = [IO.Path]::GetFullPath($file)
    if (-not $resolved.StartsWith($projectRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'File is outside project root.' }
    $relative = $resolved.Substring($projectRoot.Length + 1).Replace('\', '/')
    if ($relative -match '^(node_modules|dist|\.capture-cache|\.git)/' -or $relative -eq 'repos-raw.json' -or $relative -match '^qa-.*\.png$') { continue }
    [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $resolved, ('idea-universe/' + $relative), [IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally { $archive.Dispose() }
Write-Output $archivePath
