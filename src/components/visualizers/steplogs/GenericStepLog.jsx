// components/visualizers/steplogs/GenericStepLog.jsx

export default function GenericStepLog({ steps, currentStep, onStepChange }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="text-xs text-text-secondary px-2 py-1">
        Steps will appear here as the algorithm runs.
      </div>
    );
  }

  const getNodeLabel = (node) => {
    if (node == null) return '';
    if (typeof node === 'string' || typeof node === 'number') return node;
    if (typeof node === 'object') {
      if ('label' in node) return node.label;
      if ('id' in node) return node.id;
    }
    return JSON.stringify(node);
  };

  const normalizeEdge = (e) => {
    if (!e) return [null, null];
    if (Array.isArray(e) && e.length >= 2) return [e[0], e[1]];
    if (typeof e === 'object') {
      if ('from' in e && 'to' in e) return [e.from, e.to];
      if ('u' in e && 'v' in e) return [e.u, e.v];
    }
    return [null, null];
  };

  const edgeKey = (edge) => {
    const [u, v] = normalizeEdge(edge);
    return `${getNodeLabel(u)}->${getNodeLabel(v)}`;
  };

  const buildExplanation = (step) => {
    const activeNodes = step.activeNodes || [];
    const queue = step.queue || step.frontierNodes || [];
    const neighbours = step.neighbours || [];
    const edges = step.activeEdges || step.treeEdges || [];

    if (step.type === 'start') {
      const start = activeNodes[0];
      return (
        <>
          We start from node{' '}
          <span className="font-semibold">{getNodeLabel(start)}</span>, mark it
          visited and put it into the queue.
        </>
      );
    }

    if (step.type === 'visit' && activeNodes.length > 0) {
      const cur = activeNodes[0];
      return (
        <>
          We take node{' '}
          <span className="font-semibold">{getNodeLabel(cur)}</span> from the
          front of the queue and mark it as visited. Now we will explore its
          neighbours.
        </>
      );
    }

    if (step.type === 'expand' && activeNodes.length > 0) {
      const cur = activeNodes[0];
      return (
        <>
          From node{' '}
          <span className="font-semibold">{getNodeLabel(cur)}</span> we look at
          its neighbours{' '}
          {neighbours.map((n, i) => (
            <span key={i} className="font-semibold">
              {i > 0 && ', '}
              {getNodeLabel(n)}
            </span>
          ))}
          . Any neighbour that is not visited yet is added to the queue.
        </>
      );
    }

    if (step.type === 'relax' && edges.length > 0) {
      const [u, v] = normalizeEdge(edges[0]);
      return (
        <>
          We relax the edge{' '}
          <span className="font-semibold">
            {getNodeLabel(u)} → {getNodeLabel(v)}
          </span>{' '}
          and update the best known distance to{' '}
          <span className="font-semibold">{getNodeLabel(v)}</span> if this path
          is shorter.
        </>
      );
    }

    if (queue.length > 0 && activeNodes.length > 0) {
      const cur = activeNodes[0];
      return (
        <>
          Node{' '}
          <span className="font-semibold">{getNodeLabel(cur)}</span> is being
          processed. The queue currently contains:{' '}
          {queue.map((n, i) => (
            <span key={i} className="font-semibold">
              {i > 0 && ', '}
              {getNodeLabel(n)}
            </span>
          ))}
          .
        </>
      );
    }

    if (step.type === 'done') {
      return <>All reachable nodes have been processed. The traversal is complete.</>;
    }

    if (step.info) return <>{step.info}</>;

    return <>We are performing a helper step in the graph algorithm.</>;
  };

  return (
    <ul className="space-y-3 text-[13px]">
      {/* ONLY show steps up to currentStep for real‑time growth */}
      {steps.slice(0, currentStep + 1).map((step, index) => {
        const isCurrent = index === currentStep;

        // header chip styling
        let chipLabel = step.type ? step.type.toUpperCase() : 'STEP';
        let chipClass = 'text-text-secondary';
        if (step.type === 'start') chipClass = 'text-accent';
        else if (step.type === 'visit') chipClass = 'text-green-400';
        else if (step.type === 'expand') chipClass = 'text-blue-400';
        else if (step.type === 'relax') chipClass = 'text-yellow-400';
        else if (step.type === 'done') chipClass = 'text-green-400';
        else if (isCurrent) chipClass = 'text-accent';

        const nodes = step.nodes || [];
        const activeNodes = new Set(step.activeNodes || []);
        const visitedNodes = new Set(step.visitedNodes || []);
        const frontierNodes = new Set(step.queue || step.frontierNodes || []);

        const edges = Array.isArray(step.edges) ? step.edges : [];
        const activeEdgesSet = new Set(
          Array.isArray(step.activeEdges)
            ? step.activeEdges.map(edgeKey)
            : []
        );
        const treeEdgesSet = new Set(
          Array.isArray(step.treeEdges) ? step.treeEdges.map(edgeKey) : []
        );

        return (
          <li
            key={index}
            className={`px-3 py-2 rounded-md border border-border/40 bg-background/60
                        transition-colors duration-200 cursor-pointer
                        ${
                          isCurrent
                            ? 'bg-accent/10 border-accent/40 shadow-sm'
                            : 'hover:bg-card/60'
                        }`}
            onClick={() => onStepChange && onStepChange(index)}
          >
            {/* header */}
            <div className="flex items-center justify-between mb-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                            text-[11px] font-semibold uppercase tracking-wide ${chipClass}
                            ${isCurrent ? 'bg-black/10' : 'bg-black/5'}`}
              >
                {chipLabel}
                <span className="text-[10px] text-text-secondary/80">
                  #{index}
                </span>
              </span>

              {step.meta && (
                <span className="text-[11px] text-text-secondary/80">
                  {step.meta}
                </span>
              )}
            </div>

            {/* NODES view */}
            {nodes.length > 0 && (
              <div className="mb-2">
                <p className="text-[12px] text-text-secondary mb-1 font-semibold">
                  Nodes:
                </p>
                <div className="flex flex-wrap gap-1">
                  {nodes.map((node, idx) => {
                    const label = getNodeLabel(node);
                    const isActive =
                      activeNodes.has(node) || activeNodes.has(label);
                    const isVisited =
                      visitedNodes.has(node) || visitedNodes.has(label);
                    const isFrontier =
                      frontierNodes.has(node) || frontierNodes.has(label);

                    let cls =
                      'min-w-[2.5rem] h-9 px-2 flex items-center justify-center rounded-lg border text-xs font-semibold transition-colors';

                    if (isActive) {
                      // violet targets: bg violet, white border, white text
                      cls +=
                        ' bg-[#9F5BFF] border-white text-white shadow-lg shadow-[#9F5BFF]/40';
                    } else if (isVisited) {
                      cls +=
                        ' bg-green-500/15 border-green-400 text-green-300';
                    } else if (isFrontier) {
                      cls +=
                        ' bg-blue-500/15 border-blue-400 text-blue-300';
                    } else {
                      cls +=
                        ' bg-card/70 border-border/60 text-text-primary';
                    }

                    return (
                      <div key={idx} className={cls}>
                        {label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EDGES view (optional) */}
            {edges.length > 0 && (
              <div className="mb-2">
                <p className="text-[12px] text-text-secondary mb-1 font-semibold">
                  Edges:
                </p>
                <div className="flex flex-wrap gap-1">
                  {edges.map((edge, eIdx) => {
                    const [u, v] = normalizeEdge(edge);
                    if (u == null || v == null) return null;

                    const k = edgeKey(edge);
                    const isActive = activeEdgesSet.has(k);
                    const isTree = treeEdgesSet.has(k);

                    let cls =
                      'px-2 py-1 rounded-full border text-[11px] font-mono transition-colors';

                    if (isActive) {
                      // violet active edges
                      cls +=
                        ' bg-[#9F5BFF] border-white text-white shadow-md shadow-[#9F5BFF]/40';
                    } else if (isTree) {
                      cls +=
                        ' bg-green-500/15 border-green-400 text-green-300';
                    } else {
                      cls +=
                        ' bg-card/70 border-border/60 text-text-secondary';
                    }

                    return (
                      <span key={eIdx} className={cls}>
                        {getNodeLabel(u)} → {getNodeLabel(v)}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* explanation */}
            <p
              className={`${
                isCurrent ? 'text-text-primary' : 'text-text-secondary'
              } text-[12px] leading-relaxed`}
            >
              {buildExplanation(step)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
