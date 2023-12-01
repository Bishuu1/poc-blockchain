import express from 'express';
import bodyParser from 'body-parser';
import { Blockchain } from "./src/blockchain";
import { Block } from "./src/block";
import { Transaction } from "./src/transaction";
import { Wallet } from "./src/wallet";

const app = express();
app.use(bodyParser.json());

const blockchain = new Blockchain();

// Ruta para obtener la cadena de bloques
app.get('/block/:index', async (req: express.Request, res:express.Response) => {
  try {
    const index = parseInt(req.params.index);
    if (isNaN(index) || index < 0) {
      return res.status(400).json({ message: "Índice inválido" });
    }
    const block = await blockchain.getBlock(index);
    if (!block) {
      return res.status(404).json({ message: "Bloque no encontrado" });
    }
    res.json(block);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el bloque", error });
  }
});

// Ruta para crear una transacción
app.post('/transaction', async (req: express.Request, res:express.Response) => {
  try {
    const { fromAddress, toAddress, amount, signature } = req.body;

    // Verificar que todos los campos necesarios estén presentes
    if (!fromAddress || !toAddress || !amount || !signature) {
      return res.status(400).json({ message: "Datos insuficientes para la transacción" });
    }

    // Crear la transacción
    const transaction = new Transaction(fromAddress, toAddress, amount);
    transaction.signature = signature;

    // Verificar la validez de la transacción
    const isValid = await transaction.isValid();
    if (!isValid) {
      return res.status(400).json({ message: "Transacción no válida" });
    }

    // Añadir la transacción a la blockchain
    blockchain.addTransaction(transaction);

    res.json({ message: 'Transacción agregada', transaction });
  } catch (error) {
    res.status(500).json({ message: "Error al procesar la transacción", error });
  }
}); 

// Ruta para minar un nuevo bloque
app.post('/mine', async (req: express.Request, res:express.Response) => {
  const newBlock = await blockchain.addBlock();
  res.json({ message: 'Nuevo bloque minado', newBlock });
});

// Configura el puerto y el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

