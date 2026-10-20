#!/usr/bin/env python3
"""
Convert SVG to PNG using cairosvg or PIL
"""
import sys
import os

def convert_with_cairosvg():
    """Convert SVG to PNG using cairosvg library"""
    try:
        import cairosvg
        svg_path = os.path.join(os.path.dirname(__file__), 'DFD_CRDVS_DETAILED.svg')
        png_path = os.path.join(os.path.dirname(__file__), 'DFD_CRDVS_DETAILED.png')
        
        cairosvg.svg2png(url=svg_path, write_to=png_path, dpi=300)
        print(f"✓ Successfully converted to PNG: {png_path}")
        print(f"  File size: {os.path.getsize(png_path) / 1024:.2f} KB")
        return True
    except ImportError:
        return False
    except Exception as e:
        print(f"✗ Error with cairosvg: {e}")
        return False

def convert_with_pil():
    """Fallback: Convert using PIL and wand if available"""
    try:
        from PIL import Image
        from io import BytesIO
        import subprocess
        
        svg_path = os.path.join(os.path.dirname(__file__), 'DFD_CRDVS_DETAILED.svg')
        png_path = os.path.join(os.path.dirname(__file__), 'DFD_CRDVS_DETAILED.png')
        
        # Try using ImageMagick's convert command
        result = subprocess.run([
            'magick', 'convert',
            '-density', '300',
            svg_path,
            png_path
        ], capture_output=True)
        
        if result.returncode == 0:
            print(f"✓ Successfully converted to PNG using ImageMagick: {png_path}")
            print(f"  File size: {os.path.getsize(png_path) / 1024:.2f} KB")
            return True
    except:
        pass
    
    return False

def main():
    print("CRDVS DFD - SVG to PNG Converter")
    print("=" * 50)
    
    # Try cairosvg first
    if convert_with_cairosvg():
        sys.exit(0)
    
    # Try PIL/ImageMagick
    if convert_with_pil():
        sys.exit(0)
    
    print("\n✗ Could not convert SVG to PNG")
    print("\nTo fix this, install one of:")
    print("  pip install cairosvg")
    print("  pip install wand")
    print("  Or install ImageMagick: https://imagemagick.org/")
    sys.exit(1)

if __name__ == '__main__':
    main()
