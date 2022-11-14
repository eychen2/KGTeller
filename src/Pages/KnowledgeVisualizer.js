import ReactFlow, {
    Controls,
    useNodesState,
    useEdgesState,
  } from 'react-flow-renderer';
  import FileStuff from '../Components/FileStuff'
  import Form from '../Components/Form'
  import React, {useState} from 'react'
  import { SmartBezierEdge } from '@tisoap/react-flow-smart-edge';
  import Changefileindex from '../Components/Changefileindex';
  import TOC from '../Components/TOC'
  import Container from 'react-bootstrap/Container';
  import Row from 'react-bootstrap/Row';
  import Col from 'react-bootstrap/Col';
  import 'bootstrap/dist/css/bootstrap.min.css'
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
    const [json, setjson] = useState();
    const [files, setFiles] = useState("");
    return (
      <div className = "app">
        <div align='center'>
            <h1>Visualizer</h1>
        </div>
        
        <div className="appinfo">
        <p>Welcome to the Graph2Text visualizer, a service for you to visualize or create knowledge graphs contain in a way that's easy for you to understand!</p>
        <p>Add nodes and edges to a graph from scratch using the add node and add edge inputs, upload files and go through many graphs using the upload file features, or
             do both by adding new nodes and edges to your already existing knowledge graphs.  (Note, that this application does not currently support multigraphs).
          </p>
          <p>
            After creating or uploading graphs, you can see how they represent text by adding text using the add text feature as well as having it in your json file
          </p>
          <p>
            In order to upload preexisting knowledge graphs, they must be in a json file in the form below
          </p>
          <p>
          {'{'}"title": "title", "nodes":["node1","node2",...], "edges:"[ {'{'}"source": "sourcenodename" , "target": "targetnodename", "label" : "label"{'}'},...], "text: " "text" {'}'}
          </p>
          <p>
            If you want to save your graph, you can save it in the above form by using the save file feature and use the knowledge graph later or as an input into the model.
         </p>
        </div>
        <div align='center'>
          {files&&<h2>File Table of Contents</h2>}
        {files&&<TOC files={files} fileindex={fileindex} setfileindex={setfileindex}></TOC>}
        {files&&<h1 style={{right:450}}>{files[fileindex].Event_Name}</h1>}
        </div>
        <div align='center'>
            <ColorPara colors={colors}>{sentence}</ColorPara>
        </div>
       <Container>
        <Row>
          <FileStuff elements={nodes} setElements={setNodes} edges={edges} setEdges={setEdges} sentence={sentence} setsentence={setsentence} setjson={setjson} fileindex={fileindex} setfileindex={setfileindex} files={files} setFiles={setFiles}/>
        </Row>
        <Row style={{height:600}}>
          
          {files&&<Col style={{border: '2px solid rgba(0, 0, 0, 0.05)'}}>
          {files&&<h3>Inputted file JSON data</h3>}
          <p>{json}</p>
          </Col>}
          <Col style={{border: '2px solid rgba(0, 0, 0, 0.05)'}}>
          <ReactFlow
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Controls />
  
      </ReactFlow>
          </Col>
        </Row>
          <Row>
            <Col>
            <Form elements={nodes} setElements={setNodes} edges={edges} setEdges={setEdges} setsentence={setsentence} 
            setcolors={setcolors} setjson={setjson} fileindex={fileindex} setfileindex={setfileindex} files={files} setFiles={setFiles} />
            </Col>
            <Col>
            <Changefileindex files={files} fileindex={fileindex} setfileindex={setfileindex}/>
            </Col>
          </Row>
           
        </Container>
       
      </div>
  
      
      
    );
  };
  
  export default OverviewFlow;
  