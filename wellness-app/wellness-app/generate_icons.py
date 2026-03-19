#!/usr/bin/env python3
"""
Run this once to generate the PWA icons.
Requires: pip install Pillow
"""
import os

try:
    from PIL import Image, ImageDraw
except ImportError:
    print("Run: pip install Pillow")
    exit(1)

os.makedirs("icons", exist_ok=True)

for size in [192, 512]:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radius = int(size * 0.22)
    bg_color = (15, 110, 86, 255)
    draw.rounded_rectangle([0, 0, size, size], radius=radius, fill=bg_color)
    inner = int(size * 0.25)
    inner_r = int(size * 0.1)
    inner_color = (255, 255, 255, 200)
    draw.rounded_rectangle(
        [inner, inner, size - inner, size - inner],
        radius=inner_r,
        fill=inner_color
    )
    img.save(f"icons/icon-{size}.png")
    print(f"Created icons/icon-{size}.png")

print("Done. Icons ready.")
