const { events } = require('./events');
const { contracts } = require('./contracts');
const { connections } = require('./connections');
const { paint } = require('./paint');

const dagre = require('dagre');
const dot = require('graphlib-dot');

// ------------------------------------------------------------

const main = async () => {
  const dir = process.argv[2] || process.env.TESTCHAIN_PATH || '../testchain-dss-deployment-scripts';
  if (!dir) {
    throw new Error('you must provide a path to the testchain-deployment repository');
  }

  let graph = new dagre.graphlib.Graph({multigraph: true });

  graph = await contracts(graph, dir);
  graph = await connections(await events(graph), graph);

  console.log(`--- Graph for: ${graph.graph()} ---`);
  console.log(dot.write(graph));

  if (process.env.PAINT) await paint(graph);
};

// ------------------------------------------------------------

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}

// ------------------------------------------------------------
