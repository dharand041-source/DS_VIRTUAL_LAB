Add-Type -AssemblyName System.Drawing

$width = 512
$height = 512
$bmp = New-Object System.Drawing.Bitmap $width, $height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Clear background (transparent)
$g.Clear([System.Drawing.Color]::Transparent)

# Draw Rounded Shield / Badge Background
$bgPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$r = 120
$bgPath.AddArc(16, 16, $r, $r, 180, 90)
$bgPath.AddArc(496 - $r, 16, $r, $r, 270, 90)
$bgPath.AddArc(496 - $r, 496 - $r, $r, $r, 0, 90)
$bgPath.AddArc(16, 496 - $r, $r, $r, 90, 90)
$bgPath.CloseFigure()

$bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$g.FillPath($bgBrush, $bgPath)
$borderPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 228, 228, 231)), 12
$g.DrawPath($borderPen, $bgPath)

# Draw Subtle Circuit / Node Lines
$nodePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(180, 203, 213, 225)), 4
$nodePen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
$g.DrawLine($nodePen, 110, 190, 256, 120)
$g.DrawLine($nodePen, 402, 190, 256, 120)
$g.DrawLine($nodePen, 70, 270, 130, 350)
$g.DrawLine($nodePen, 442, 270, 382, 350)

# Draw Node Circles
$blueBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 37, 99, 235))
$redBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 239, 68, 68))
$greenBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 16, 185, 129))
$amberBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 245, 158, 11))

$g.FillEllipse($blueBrush, 102, 182, 18, 18)
$g.FillEllipse($redBrush, 394, 182, 18, 18)
$g.FillEllipse($greenBrush, 62, 262, 18, 18)
$g.FillEllipse($amberBrush, 434, 262, 18, 18)

# Draw Skullcap Base
$darkBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 9, 9, 11))
$capBasePath = New-Object System.Drawing.Drawing2D.GraphicsPath
$capBasePath.AddLine(150, 210, 150, 280)
$capBasePath.AddArc(150, 230, 212, 100, 180, -180)
$capBasePath.AddLine(362, 280, 362, 210)
$capBasePath.CloseFigure()
$g.FillPath($darkBrush, $capBasePath)

# Draw Mortarboard Top (Diamond)
[System.Drawing.Point[]]$mortarPoints = @(
    (New-Object System.Drawing.Point 256, 88),
    (New-Object System.Drawing.Point 444, 178),
    (New-Object System.Drawing.Point 256, 268),
    (New-Object System.Drawing.Point 68, 178)
)
$mortarBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (New-Object System.Drawing.Point 256, 88), (New-Object System.Drawing.Point 256, 268), ([System.Drawing.Color]::FromArgb(255, 30, 30, 35)), ([System.Drawing.Color]::FromArgb(255, 9, 9, 11))
$g.FillPolygon($mortarBrush, $mortarPoints)
$mortarPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 9, 9, 11)), 4
$g.DrawPolygon($mortarPen, $mortarPoints)

# Golden Button
$goldBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (New-Object System.Drawing.Point 240, 164), (New-Object System.Drawing.Point 272, 196), ([System.Drawing.Color]::FromArgb(255, 251, 191, 36)), ([System.Drawing.Color]::FromArgb(255, 217, 119, 6))
$g.FillEllipse($goldBrush, 244, 166, 24, 24)

# Ribbon Tassel
$tasselPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 220, 38, 38)), 10
$tasselPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$tasselPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawBezier($tasselPen, 256, 178, 360, 190, 390, 240, 390, 320)
$tasselEndBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 220, 38, 38))
$g.FillRectangle($tasselEndBrush, 376, 318, 28, 42)
$g.FillEllipse($goldBrush, 384, 356, 12, 12)

# Open Education Book Base
$bookCoverBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (New-Object System.Drawing.Point 110, 330), (New-Object System.Drawing.Point 400, 410), ([System.Drawing.Color]::FromArgb(255, 37, 99, 235)), ([System.Drawing.Color]::FromArgb(255, 29, 78, 216))
[System.Drawing.Point[]]$bookCoverPoints = @(
    (New-Object System.Drawing.Point 112, 336),
    (New-Object System.Drawing.Point 256, 328),
    (New-Object System.Drawing.Point 400, 336),
    (New-Object System.Drawing.Point 400, 404),
    (New-Object System.Drawing.Point 256, 396),
    (New-Object System.Drawing.Point 112, 404)
)
$g.FillPolygon($bookCoverBrush, $bookCoverPoints)

# Left Page (White)
$whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
[System.Drawing.Point[]]$leftPagePoints = @(
    (New-Object System.Drawing.Point 124, 344),
    (New-Object System.Drawing.Point 250, 336),
    (New-Object System.Drawing.Point 250, 388),
    (New-Object System.Drawing.Point 124, 396)
)
$g.FillPolygon($whiteBrush, $leftPagePoints)

# Right Page (White)
[System.Drawing.Point[]]$rightPagePoints = @(
    (New-Object System.Drawing.Point 262, 336),
    (New-Object System.Drawing.Point 388, 344),
    (New-Object System.Drawing.Point 388, 396),
    (New-Object System.Drawing.Point 262, 388)
)
$g.FillPolygon($whiteBrush, $rightPagePoints)

# Spine
$spinePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 15, 23, 42)), 6
$g.DrawLine($spinePen, 256, 324, 256, 404)

# Text / Code lines on Pages
$codePenGray = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 148, 163, 184)), 4
$codePenGray.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$codePenGray.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawLine($codePenGray, 142, 356, 232, 350)
$g.DrawLine($codePenGray, 142, 368, 214, 364)
$g.DrawLine($codePenGray, 142, 380, 228, 376)

$codePenRed = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 220, 38, 38)), 4
$codePenRed.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$codePenRed.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawLine($codePenRed, 280, 350, 370, 356)

$codePenBlue = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 37, 99, 235)), 4
$codePenBlue.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$codePenBlue.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawLine($codePenBlue, 296, 364, 370, 368)

$codePenGreen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 16, 185, 129)), 4
$codePenGreen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$codePenGreen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawLine($codePenGreen, 284, 376, 370, 380)

# Save to public/logo.png
$outputPath = Join-Path (Get-Location) "public\logo.png"
$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Host "Successfully generated logo at $outputPath"
