import cassandra from "cassandra-driver";
const distance = cassandra.types.distance;
import fs from "fs";
import env from "secretenvmgr";
await env.load();

const authProvider = new cassandra.auth.PlainTextAuthProvider(
  process.env.CUSER,
  process.env.PASS
);

const sslOptions = {
  cert: fs.readFileSync("AmazonRootCA1.pem"),
  host: process.env.CASSANDRA_IP,
  rejectUnauthorized: true,
};
const contactPoints = [
  `${process.env.CASSANDRA_IP}:${process.env.CASSANDRA_PORT}`,
];
const client = new cassandra.Client({
  contactPoints: contactPoints,
  authProvider: authProvider,
  localDataCenter: process.env.DATACENTER,
  sslOptions: sslOptions,
  pooling: {
    coreConnectionsPerHost: {
      [distance.local]: 2,
      [distance.remote]: 1,
    },
  },
  socketOptions: {
    connectTimeout: 5000,
    keepAlive: false,
    keepAliveDelay: 0,
    tcpNoDelay: true,
  },
  queryOptions: {
    prepare: true,
    consistency: cassandra.types.consistencies.localQuorum,
  },
});

export default client;
