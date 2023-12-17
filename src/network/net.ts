import { Stream } from 'libp2p';
import readline from 'readline';

class Communicator {
  constructor(private libp2pNode: any) {}

  setupStreamHandler(protocol: string) {
    this.libp2pNode.handle(protocol, (stream: Stream) => {
      this.handleStream(stream);
    });
  }

  private handleStream(stream: Stream) {
    console.log(`Stream received from peer ${stream.id}`);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const readStream = () => {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write('\x1b[32m> \x1b[0m');
    };

    rl.on('line', (line) => {
      stream.sink.push(Buffer.from(`${line}\n`));
      readStream();
    });

    stream.source.forEach(async (msg: any) => {
      console.log(`\x1b[32m${msg.toString().trim()}\x1b[0m`);
      readStream();
    });
  }
}

export default Communicator;
