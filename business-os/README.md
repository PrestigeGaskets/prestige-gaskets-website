# Business OS (C++ scaffold)

Console `.exe` composition rooted in the `SMB-Operating-System.xlsx` domain
verified by `_verify_aec5.py`.

## Build (Visual Studio)

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

## CLI commands

`dashboard` · `quotes` · `products` · `customers` · `orders` · `help` · `quit`
