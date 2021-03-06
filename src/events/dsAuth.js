const { message, getRawLogs } = require('./shared');

module.exports.fromGraph = async (graph, eventName) => {
  const out = await Promise.all(
    graph.nodes().map(async label => {
      const node = graph.node(label);
      if (!node.abis.includes(eventName)) return [];

      const events = await fromContract(node.contract, eventName);
      message(events.length, eventName, label);

      return events;
    })
  );

  return [].concat.apply([], out);
};

// ------------------------------------------------------------

fromContract = async (contract, eventName) => {
  const out = {
    type: eventName,
    src: contract.options.address,
    blockNumber: -1
  };

  const address = await contract.methods[eventName]().call();
  out.dst = address;

  return [out];
};

// ------------------------------------------------------------
