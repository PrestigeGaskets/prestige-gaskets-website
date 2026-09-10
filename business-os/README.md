# Business OS (C++ scaffold + GUI demo)

Standalone **Business OS** aimed at a slick desktop GUI `.exe`, rooted in the
`SMB-Operating-System.xlsx` domain verified by `_verify_aec5.py`.

## GUI preview (HTML twin of the C++ app)

Open the visual stand-in that mirrors `Application` / services:

```bash
# from this folder
python3 -m http.server 8765 --directory gui-demo
# → http://127.0.0.1:8765/
```

Or open `gui-demo/index.html` directly. Nav views match the C++ commands:
Dashboard, Quotes, Products, Customers, Orders — same seed data and totals.

## Build the `.exe` (Visual Studio)

1. Open `BusinessOS.sln`
2. Select **Release | x64**
3. Build → output: `bin/Release/BusinessOS.exe`

## Build (CMake, optional)

```bash
cmake -S . -B build
cmake --build build
printf 'quit\n' | ./build/BusinessOS
```

## Class plan

See [docs/CLASS_INTERACTION_PLAN.md](docs/CLASS_INTERACTION_PLAN.md).
