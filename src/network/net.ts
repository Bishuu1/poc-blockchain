import * as Libp2p from 'libp2p';
import readline from 'readline';
import { pipe } from 'it-pipe';
import { toBuffer } from 'it-to-buffer';
import BufferList from 'bl/BufferList';

class Communicator {
  constructor(private libp2pNode: any) {}

  setupStreamHandler(protocol: string) {
    this.libp2pNode.handle(protocol, async ({ stream }) => {
      console.log(`Stream received`);
      this.handleStream(stream);
    });
  }

  private async handleStream(stream: any) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.on('line', (line) => {
      stream.sink.push(Buffer.from(line + '\n'));
    });

    await pipe(
      stream.source,
      async function (source: AsyncIterable<BufferList>) {
        for await (const msg of source) {
          console.log(`Received message: ${msg.toString().trim()}`);
        }
      }
    );
  }
}

export default Communicator;
