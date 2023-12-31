import { createLibp2p } from 'libp2p'
import { tcp } from "@libp2p/tcp";
import { mplex } from "@libp2p/mplex";
import { noise } from "@chainsafe/libp2p-noise";
import { mdns } from '@libp2p/mdns';
import Communicator from "./net";

const ProtocolDataSharing = "data-sharing";

class Nodo {
    public node: any;
    private connectedPeers: Map<string, any>;
    //private communicator: Communicator;

    constructor(private port: number) {
        this.connectedPeers = new Map();
        //this.communicator = new Communicator(this.node);

    }

    async start() {
        this.node = await createLibp2p({
            addresses: {
                listen: [`/ip4/0.0.0.0/tcp/${this.port}`],
            },
            transports: [tcp()],
            streamMuxers: [mplex()],
            connectionEncryption: [noise()],
            peerDiscovery: [mdns()],
        });
        //this.communicator.setupStreamHandler(ProtocolDataSharing);

        this.node.on(
            "peer:discovery",
            (peerId: { toB58String: () => string }) => {
                console.log("Discovered:", peerId.toB58String());
                // Almacenar información adicional sobre el par si es necesario
                this.connectedPeers.set(peerId.toB58String(), "hola");
            }
        );

        await this.node.start();
        console.log(
            "Node started with peerId:",
            this.node.peerId.toB58String()
        );
    }

    async stop() {
        await this.node.stop();
        console.log("Node stopped");
    }

    getConnectedPeers(): string[] {
        return Array.from(this.connectedPeers.keys());
    }
}

export default Nodo;
