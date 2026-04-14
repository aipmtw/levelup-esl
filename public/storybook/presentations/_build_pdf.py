"""
Convert aipm-group2-intro-zh-take2.md → HTML → PDF
- Reads markdown with tables, fenced code, and emojis
- Produces a print-friendly HTML with CJK-safe CSS (Microsoft JhengHei primary)
- Then a separate Chrome-headless step converts HTML to PDF
Usage: python _build_pdf.py
"""
import sys
from pathlib import Path
import markdown as md

HERE = Path(__file__).parent
SRC_MD = HERE / "aipm-group2-intro-zh-take2.md"
OUT_HTML = HERE / "aipm-group2-intro-zh-take2.html"

def main():
    if not SRC_MD.exists():
        print(f"ERROR: source not found: {SRC_MD}", file=sys.stderr)
        sys.exit(1)

    md_text = SRC_MD.read_text(encoding="utf-8")

    body_html = md.markdown(
        md_text,
        extensions=[
            "extra",       # tables, fenced_code, etc.
            "sane_lists",
            "toc",
        ],
        output_format="html5",
    )

    css = """
    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
    }
    html, body {
      font-family: "Microsoft JhengHei", "PingFang TC", "Noto Sans CJK TC",
                   "Noto Serif CJK TC", "Source Han Sans TC", "Heiti TC",
                   "Segoe UI", system-ui, sans-serif;
      font-size: 10.5pt;
      line-height: 1.55;
      color: #111;
      background: #fff;
      -webkit-font-smoothing: antialiased;
    }
    body {
      max-width: 175mm;
      margin: 0 auto;
      padding: 0;
    }
    h1 {
      font-size: 20pt;
      border-bottom: 2px solid #111;
      padding-bottom: 4px;
      margin-top: 0;
      page-break-after: avoid;
    }
    h2 {
      font-size: 14.5pt;
      color: #1a1a1a;
      border-bottom: 1px solid #bbb;
      padding-bottom: 3px;
      margin-top: 22px;
      page-break-after: avoid;
    }
    h3 {
      font-size: 12pt;
      color: #222;
      margin-top: 16px;
      page-break-after: avoid;
    }
    h4 {
      font-size: 11pt;
      color: #333;
      margin-top: 12px;
      page-break-after: avoid;
    }
    p { margin: 6px 0 10px 0; }
    ul, ol { margin: 6px 0 10px 18px; padding-left: 8px; }
    li { margin: 3px 0; }
    strong { color: #000; }
    em { color: #333; }
    hr {
      border: 0;
      border-top: 1px dashed #999;
      margin: 18px 0;
    }
    blockquote {
      border-left: 3px solid #8a8a8a;
      margin: 10px 0;
      padding: 6px 12px;
      background: #f6f6f6;
      color: #333;
      font-size: 10pt;
    }
    blockquote p { margin: 4px 0; }
    code {
      font-family: "Cascadia Mono", "Consolas", "Courier New", monospace;
      font-size: 9.5pt;
      background: #f2f2f2;
      padding: 1px 4px;
      border-radius: 3px;
    }
    pre {
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
      padding: 10px 12px;
      border-radius: 4px;
      font-size: 9.5pt;
      line-height: 1.4;
      overflow-x: auto;
      page-break-inside: avoid;
    }
    pre code { background: transparent; padding: 0; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #bbb;
      padding: 6px 8px;
      vertical-align: top;
      text-align: left;
    }
    th {
      background: #eee;
      font-weight: bold;
    }
    tr:nth-child(even) td { background: #fafafa; }
    a { color: #0b5ed7; text-decoration: none; }
    /* Page-break hints */
    h1, h2, h3 { break-after: avoid; }
    table, pre, blockquote { break-inside: avoid; }
    /* Footer identification */
    .doc-footer {
      margin-top: 26px;
      padding-top: 8px;
      border-top: 1px solid #ccc;
      color: #777;
      font-size: 9pt;
      text-align: center;
    }
    """

    html = f"""<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<title>AIPM Group 2 Intro — take 2</title>
<style>{css}</style>
</head>
<body>
{body_html}
<div class="doc-footer">
  markluce.ai &middot; biz-plan/presentations/aipm-group2-intro-zh-take2.md &middot; take 2
</div>
</body>
</html>
"""

    OUT_HTML.write_text(html, encoding="utf-8")
    print(f"HTML written: {OUT_HTML}")

if __name__ == "__main__":
    main()
