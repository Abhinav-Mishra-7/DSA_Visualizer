import { motion } from 'framer-motion';
import MessageBox from '../../../shared/MessageBox';

export default function DijkstraAnnotation({ stepData }) {
    if (!stepData?.info) return null;

    // Always center the message box
    const messageStyle = { left: '50%', transform: 'translateX(-50%)' };

    // Distance table for key nodes
    const getDistanceTable = () => {
        if (!stepData.distances) return null;
        
        const distances = Object.entries(stepData.distances)
            .filter(([node, dist]) => dist !== Infinity)
            .sort(([a], [b]) => a.localeCompare(b));
            
        if (distances.length === 0) return null;
        
        return distances;
    };

    // Node state legends for Dijkstra
    const getNodeLegend = () => {
        const legends = [];
        
        if (stepData.current) {
            legends.push({ color: 'bg-yellow-400', label: 'Processing', count: 1 });
        }
        
        if (stepData.priorityQueue && stepData.priorityQueue.length > 0) {
            legends.push({ color: 'bg-purple-500', label: 'In PQ', count: stepData.priorityQueue.length });
        }
        
        if (stepData.visited && stepData.visited.length > 0) {
            legends.push({ color: 'bg-accent', label: 'Finalized', count: stepData.visited.length });
        }
        
        return legends;
    };

    // Edge state legends
    const getEdgeLegend = () => {
        const legends = [];
        
        if (stepData.activeEdge) {
            legends.push({ color: 'bg-yellow-400', label: 'Active Edge', count: 1 });
        }
        
        if (stepData.relaxingEdges && stepData.relaxingEdges.length > 0) {
            legends.push({ color: 'bg-green-500', label: 'Relaxed', count: stepData.relaxingEdges.length });
        }
        
        return legends;
    };

    const distanceTable = getDistanceTable();
    const nodeLegend = getNodeLegend();
    const edgeLegend = getEdgeLegend();
    const allLegends = [...nodeLegend, ...edgeLegend];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none z-10"
        >
            {/* Main message box */}
            <div className="absolute top-4 w-full">
                <MessageBox 
                    message={{ text: stepData.info }} 
                    style={messageStyle}
                />
            </div>

            {/* Distance table */}
            {distanceTable && distanceTable.length > 0 && (
                <div className="absolute top-4 right-4">
                    <div className="bg-card/95 border border-border rounded-lg px-3 py-2">
                        <div className="text-xs font-semibold text-text-primary mb-1">Distances</div>
                        <div className="space-y-1">
                            {distanceTable.map(([node, distance]) => (
                                <div key={node} className="flex justify-between gap-3 text-xs text-text-secondary">
                                    <span className="font-mono">{node}:</span>
                                    <span className="font-mono font-bold">{distance}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Combined legend */}
            {allLegends.length > 0 && (
                <div className="absolute bottom-6 w-full">
                    <div className="flex justify-center">
                        <div className="flex flex-wrap gap-4 bg-card/90 border border-border rounded-lg px-4 py-2 max-w-4xl">
                            {allLegends.map((legend, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs text-text-secondary">
                                    <div className={`w-3 h-3 rounded-full ${legend.color}`}></div>
                                    <span>{legend.label} ({legend.count})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}