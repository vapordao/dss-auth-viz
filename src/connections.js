// ------------------------------------------------------------

// iterates over events and adds / removes edges accordingly
module.exports.connections = async (events, graph) => {
  events.map(event => {
    if (!event) { return graph; }
    console.log(`event at blockNumber: ${event.blockNumber}, ${event.src}, ${event.type}, ${event.dst}`);
    const src = label(event.src, graph);
    const dst = label(event.dst, graph);

    if (!src || !dst) { return graph; }
    console.log(`connecting node: ${src} to ${dst}`);

    switch (event.type) {
      case 'rely': {
        graph.setEdge(src, dst, {label: 'rely'});
        break;
      }

      case 'deny': {
        graph.removeEdge(src, dst);
        break;
      }

      case 'LogSetOwner': {
        graph.setEdge(src, dst, {label: 'owner'});
        break;
      }

      case 'LogSetAuthority': {
        graph.setEdge(src, dst, {label: 'authority'});
        break;
      }
    }
  });

  return graph;
};

// ------------------------------------------------------------

// reverse lookup a label from an address
const label = (address, graph) => {
  const labels = graph.nodes().filter(label => {
    return (
      graph.node(label).contract.options.address.toLowerCase() ===
      address.toLowerCase()
    );
  });

  if (labels.length === 0) {
    // throw new Error(`no nodes found with address ${address}`);
    console.log(`----- no nodes found with address ${address} ----- `);
    return false;
  }

  if (labels.length > 1) {
    throw new Error(`more than one node in the graph with address ${address}`);
  }

  return labels[0];
};

// ------------------------------------------------------------
