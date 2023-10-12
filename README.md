# poc-blockchain

El proyecto esta creado con un devcontainer, por lo que para facilitar la instalación y uso de este se recomienda usar esta caracteristica a través de vscode [DevContainer](https://code.visualstudio.com/docs/devcontainers/containers).
En dicho caso, solo es necesario usar el comando:

```bash
bun run index.ts
```

En caso contrario, es necesario instalar algún runtime de javascript/typescript, aunque se sugiere bun [Bun](https://bun.sh) es posible usar cualquier otro runtime, ya sea nodejs o deno y sus respectivos empaquetadores como npm, deno, pnpm.

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.3. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

To-do:
- [ ] Cambiar de BIP39 a BIP32
- [ ] Agregar tokens/nfts
