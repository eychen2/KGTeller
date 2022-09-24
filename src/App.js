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
import Changefileindex from './Changefileindex';
import TOC from './TOC'
const edgeTypes = {
	smart: SmartBezierEdge
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
  const [fileindex,setfileindex]= useState(0);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [sentence, setsentence] = useState('');
  const [colors, setcolors] = useState([]);
  const [json, setjson] = useState({nodes:'',edges:'', text:''});
  const [files, setFiles] = useState("");
  
  return (
    <div className = "app">
      <h1>Graph2Text</h1>
      <div className="appinfo">
        <p>Welcome to Graph2Text, a servivce for you to visualize the information knowledge graphs contain in a way that's easy for you to understand!</p>
        <p>Add nodes to the graph by typing in the bar left of the add node button and then pressing add node button. Add edges using the add edge button where source is the starting node of the edge, target is the ending node of the edge, and label is the label you wish to add to the edge.
           Note, that multigraphs are not currently supported with this application
          To see how a knowledge graph represents text, type in text to the add text box and use the add text feature to add some text and see what it looks like.
        </p>
        <p>
          In order to see knowledge graphs that you've already created before, use the add file feature to visualize them.
          The file must be a json where each element is in the form  
        </p>
        <p>
        {'{'}"nodes":["node1","node2",...], "edges:"[ {'{'}"source": "sourcenodename" , "target": "targetnodename", "label" : "label"{'}'},...], "text: " "text" {'}'}
        </p>
        <p>
          The save file button will save the current graph in the same format as above and is ready to be reinserted into the application at any point by adding the saved file.
        </p>
        <p>
          The clear all button resets everything.
        </p>
      </div>
      <h2>Knowledge Graph Visualizer</h2>
      <Form elements={nodes} setElements={setNodes} edges={edges} setEdges={setEdges} setsentence={setsentence} setcolors={setcolors} setjson={setjson} fileindex={fileindex} setfileindex={setfileindex} files={files} setFiles={setFiles}/>
      <ColorPara colors={colors}>{sentence}</ColorPara>
      {files&&<h3>Inputted file JSON data</h3>}
      <p>{json.nodes}</p>
      <p>{json.edges}</p>
      <p>{json.text}</p>
      {files&&<h2>File Table of Contents</h2>}
      {files&&<TOC files={files} fileindex={fileindex} setfileindex={setfileindex}></TOC>}
      {files&&<h1 style={{position:'absolute', right:450}}>{files[fileindex].title}</h1>}
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
      <Changefileindex files={files} fileindex={fileindex} setfileindex={setfileindex}/>
    </div>

    
    
  );
};

export default OverviewFlow;
