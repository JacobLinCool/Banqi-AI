# Banqi-AI

Automove Original C source by Howard9199. (https://github.com/howard9199/AI-banqi)

TypeScript rewrite by JacobLinCool.

## Usage

### Install Dependencies

```bash
npm i
```

### Build

```bash
npm run build
```

### Run

```bash
dist/bqai-[win,macos,linux] <executable path> [flags]
```

#### Flags

```bash
  -b: Buffer timeout in milliseconds.
  -d: Reaction delay in milliseconds.
  -o: Output file path.
  -r: Realtime Debug.
```

## Notice

You must flush the output stream before scanning the input stream.

Use `fflush(stdout);` before scanning the input stream.

For Example:

```diff
  printf("Player 1 (x,y): ");
  int x, y;
+ fflush(stdout);
  scanf("%d,%d", &x, &y);
```
