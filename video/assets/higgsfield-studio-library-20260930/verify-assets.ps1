$ErrorActionPreference = 'Stop'
$studioDir = $PSScriptRoot
$studioRepo = (Resolve-Path (Join-Path $studioDir '../../..')).Path
$studioFfmpeg = Join-Path $studioRepo 'video/remotion/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
$studioFfprobe = Join-Path $studioRepo 'video/remotion/node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe'
$studioManifest = Get-Content -LiteralPath (Join-Path $studioDir 'manifest.json') -Raw | ConvertFrom-Json
$previewDir = Join-Path $studioDir 'previews'
$silentDir = Join-Path $studioDir 'silent'
New-Item -ItemType Directory -Path $previewDir -Force | Out-Null
New-Item -ItemType Directory -Path $silentDir -Force | Out-Null
Add-Type -AssemblyName System.Drawing
$metadata = @()
$localClips = @($studioManifest.video_jobs | Where-Object { $_.status -eq 'completed' -and (Test-Path -LiteralPath (Join-Path $studioDir $_.file)) } | Sort-Object index)
foreach ($clip in $localClips) {
  $clipPath = Join-Path $studioDir $clip.file
  $silentPath = Join-Path $silentDir $clip.file
  if (-not (Test-Path -LiteralPath $silentPath)) {
    & $studioFfmpeg -hide_banner -loglevel error -i $clipPath -map 0:v:0 -an -c:v copy -y $silentPath
    if ($LASTEXITCODE -ne 0) { throw "Silent remux failed: $($clip.file)" }
  }
  $rawProbe = (& $studioFfprobe -v error -show_entries 'format=duration:stream=codec_type,width,height' -of json $clipPath | ConvertFrom-Json)
  $silentProbe = (& $studioFfprobe -v error -show_entries 'format=duration:stream=codec_type,width,height' -of json $silentPath | ConvertFrom-Json)
  if ($LASTEXITCODE -ne 0) { throw "Probe failed: $($clip.file)" }
  $videoStream = @($rawProbe.streams | Where-Object codec_type -eq 'video')[0]
  if ($videoStream.width -ne 2560 -or $videoStream.height -ne 1440) { throw "Unexpected dimensions: $($clip.file)" }
  if ([double]$rawProbe.format.duration -lt 10 -or [double]$rawProbe.format.duration -gt 10.5) { throw "Unexpected duration: $($clip.file)" }
  if (@($silentProbe.streams | Where-Object codec_type -eq 'audio').Count -gt 0) { throw "Audio remains: $($clip.file)" }
  $metadata += [ordered]@{ index=$clip.index; file=$clip.file; width=$videoStream.width; height=$videoStream.height; duration=[double]$rawProbe.format.duration; silent_file=('silent/'+$clip.file); silent_audio_streams=0; sample_seconds=@(1,5,9) }
  foreach ($sampleTime in @(1,5,9)) {
    $framePath = Join-Path $previewDir ('{0:d2}-t{1}.png' -f $clip.index,$sampleTime)
    if (-not (Test-Path -LiteralPath $framePath)) {
      & $studioFfmpeg -hide_banner -loglevel error -ss $sampleTime -i $clipPath -vf scale=512:288 -frames:v 1 -update 1 -y $framePath
      if ($LASTEXITCODE -ne 0) { throw "Frame extraction failed: $($clip.file)" }
    }
  }
}
$metadata | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $studioDir 'verification.json') -Encoding utf8
$studioFont = [System.Drawing.Font]::new('Arial',14)
for ($batchStart=0; $batchStart -lt $localClips.Count; $batchStart+=6) {
  $batchClips = @($localClips | Select-Object -Skip $batchStart -First 6)
  $sheet = [System.Drawing.Bitmap]::new(1536,312*$batchClips.Count)
  $graphics = [System.Drawing.Graphics]::FromImage($sheet)
  $graphics.Clear([System.Drawing.Color]::FromArgb(8,27,42))
  $rowIndex=0
  foreach ($clip in $batchClips) {
    $columnIndex=0
    foreach ($sampleTime in @(1,5,9)) {
      $framePath=Join-Path $previewDir ('{0:d2}-t{1}.png' -f $clip.index,$sampleTime)
      $frame=[System.Drawing.Image]::FromFile($framePath)
      $graphics.DrawImage($frame,$columnIndex*512,$rowIndex*312,512,288)
      $frame.Dispose()
      $graphics.DrawString(('{0:d2} {1} / {2}s' -f $clip.index,$clip.title,$sampleTime),$studioFont,[System.Drawing.Brushes]::White,[float]($columnIndex*512),[float]($rowIndex*312+288))
      $columnIndex++
    }
    $rowIndex++
  }
  $sheet.Save((Join-Path $previewDir ('video-review-{0}.jpg' -f ([int]($batchStart/6)+1))),[System.Drawing.Imaging.ImageFormat]::Jpeg)
  $graphics.Dispose()
  $sheet.Dispose()
}
$studioFont.Dispose()
Write-Output ("Verified {0} clips: 2560x1440, ~10 seconds, silent copies have no audio streams." -f $localClips.Count)

