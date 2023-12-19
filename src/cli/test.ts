import Nodo from "../network/node.ts";

async function startNode(port: number) {
    const node = new Nodo(port);
    await node.start();
    console.log(
        `Nodo iniciado con peerId: ${node.node.getPeerId()} en el puerto ${port}`
    );
    return node;
}

async function startBlockchain() {
    const numberOfNodes = 3; // Ajusta esto según el número de nodos que deseas iniciar
    const nodes = [];

    for (let i = 0; i < numberOfNodes; i++) {
        const port = 1111 + i; // Asegúrate de que cada nodo escuche en un puerto diferente
        const node = await startNode(port);
        nodes.push(node);
    }

    // Aquí puedes agregar lógica adicional para conectar nodos entre sí o realizar operaciones iniciales
}

startBlockchain().catch((error) => {
    console.error("Error al iniciar la blockchain:", error);
});
