"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const CANVAS_SIZE = 720;

function toColor(value: string, fallback: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
  if (/^[0-9a-fA-F]{6}$/.test(value)) return `#${value}`;
  return fallback;
}

export function FrameGenerator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [label, setLabel] = useState("TEAM NIUM");
  const [frameColor, setFrameColor] = useState("#ff0000");
  const [labelBackground, setLabelBackground] = useState("#ffd84d");
  const [frameThickness, setFrameThickness] = useState(42);
  const [labelOffset, setLabelOffset] = useState(28);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    setFrameColor(toColor(hash.get("frame-color-2") ?? "", "#ff0000"));
    setLabelBackground(toColor(hash.get("label-background") ?? "", "#ffd84d"));
    const labelOffsetParam = Number(hash.get("text-offset"));
    if (Number.isFinite(labelOffsetParam) && labelOffsetParam >= 0) {
      setLabelOffset(Math.min(120, Math.max(10, labelOffsetParam)));
    }
  }, []);

  const hasImage = useMemo(() => Boolean(image), [image]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.fillStyle = "#10131e";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (image) {
      const ratio = Math.max(CANVAS_SIZE / image.width, CANVAS_SIZE / image.height);
      const drawWidth = image.width * ratio;
      const drawHeight = image.height * ratio;
      const dx = (CANVAS_SIZE - drawWidth) / 2;
      const dy = (CANVAS_SIZE - drawHeight) / 2;
      ctx.drawImage(image, dx, dy, drawWidth, drawHeight);
    }

    ctx.strokeStyle = frameColor;
    ctx.lineWidth = frameThickness;
    ctx.strokeRect(
      frameThickness / 2,
      frameThickness / 2,
      CANVAS_SIZE - frameThickness,
      CANVAS_SIZE - frameThickness,
    );

    const labelHeight = 72;
    const labelY = CANVAS_SIZE - labelHeight - labelOffset;
    const labelPaddingX = 22;

    const displayLabel = label.trim() || "TEAM NIUM";
    ctx.font = "700 36px Inter, system-ui, sans-serif";
    const labelWidth = Math.min(ctx.measureText(displayLabel).width + labelPaddingX * 2, CANVAS_SIZE - 48);
    const labelX = (CANVAS_SIZE - labelWidth) / 2;

    ctx.fillStyle = labelBackground;
    ctx.fillRect(labelX, labelY, labelWidth, labelHeight);

    ctx.fillStyle = "#10131e";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayLabel, CANVAS_SIZE / 2, labelY + labelHeight / 2);
  }, [frameColor, frameThickness, image, label, labelBackground, labelOffset]);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const nextImage = new Image();
      nextImage.onload = () => setImage(nextImage);
      nextImage.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "banner-frame.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <Paper elevation={0} sx={{ p: 3, border: "1px solid rgba(78,124,255,0.2)", borderRadius: 3 }}>
      <Stack spacing={2.5}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Banner & Frame Generator
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload a photo, customize the frame and label, then export a PNG.
        </Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Stack spacing={2} sx={{ flex: 1 }}>
            <Button variant="outlined" component="label">
              Upload image
              <input type="file" hidden accept="image/*" onChange={onFileChange} />
            </Button>
            <TextField label="Label text" value={label} onChange={(e) => setLabel(e.target.value.toUpperCase())} />
            <TextField label="Frame color" type="color" value={frameColor} onChange={(e) => setFrameColor(e.target.value)} />
            <TextField label="Label background" type="color" value={labelBackground} onChange={(e) => setLabelBackground(e.target.value)} />
            <Box>
              <Typography gutterBottom>Frame thickness ({frameThickness}px)</Typography>
              <Slider value={frameThickness} min={10} max={80} onChange={(_, v) => setFrameThickness(v as number)} />
            </Box>
            <Box>
              <Typography gutterBottom>Label offset ({labelOffset}px)</Typography>
              <Slider value={labelOffset} min={10} max={120} onChange={(_, v) => setLabelOffset(v as number)} />
            </Box>
            <Button variant="contained" onClick={download} disabled={!hasImage}>
              Download PNG
            </Button>
          </Stack>

          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} style={{ width: "100%", maxWidth: 460, borderRadius: 12 }} />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
