import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import Form from './Form'
import React, {useEffect, useState} from 'react'
import { SmartBezierEdge } from '@tisoap/react-flow-smart-edge';
const edgeTypes = {
	smart: SmartBezierEdge
}
const getRandomColor = () => {
  const colors = ['red', 'orange', 'green', 'blue']
  return colors[Math.floor(Math.random() * colors.length)];
}
const getColor = (colors, index) => {
  return colors[index];
}
const ColorPara = (props, colors) => {
  var i=0;
  return (
    <p>
      {props.children.split(' ').map(text => {
        return (
          <div style={{ color: getColor(props.colors, i++), display: 'inline', }}>
            {text} &nbsp;
          </div>
        )
      })}
    </p>
  )
}
const OverviewFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [sentence, setsentence] = useState('');
  const [colors, setcolors] = useState([]);
  const [json, setjson] = useState({nodes:'',edges:'', text:''});
  
  return (
    <div className = "app">
      <Form elements={nodes} setElements={setNodes} edges={edges} setEdges={setEdges} setsentence={setsentence} setcolors={setcolors} setjson={setjson}/>
      <ColorPara colors={colors}>{sentence}</ColorPara>
      <h3>JSON text</h3>
      <p>{json.nodes}</p>
      <p>{json.edges}</p>
      <p>{json.text}</p>
      <div style={{height: 800}}>
      <ReactFlow
      edgeTypes={edgeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <MiniMap
        nodeStrokeColor={(n) => {
          if (n.style?.background) return n.style.background;
          if (n.type === 'input') return '#0041d0';
          if (n.type === 'output') return '#ff0072';
          if (n.type === 'default') return '#1a192b';

          return '#eee';
        }}
        nodeColor={(n) => {
          if (n.style?.background) return n.style.background;

          return '#fff';
        }}
        nodeBorderRadius={2}
      />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
      </div>
    </div>
    
    
  );
};

export default OverviewFlow;
