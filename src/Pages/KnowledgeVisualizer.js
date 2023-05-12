  import ReactFlow, {
      Controls,
      useNodesState,
      useEdgesState,
      isNode
    } from 'react-flow-renderer';
    import ReactJson from 'react-json-view'
    import TextDisplay from '../Components/TextDisplay';
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
    import '../App.css'
    import '../assets/remixicon/remixicon.css'
    const edgeTypes = {
        smart: SmartBezierEdge
    }
    
    const getColor = (colors, index) => {
      return colors[index];
    }

    const OverviewFlow = () => {
      const [fileindex,setfileindex]= useState(0);
      const [nodes, setNodes, onNodesChange] = useNodesState([]);
      const [edges, setEdges, onEdgesChange] = useEdgesState([]);
      const [sentence, setsentence] = useState('');
      const [colors, setcolors] = useState([])
      const [cm, setcm] = useState(new Map())
      const [json, setjson] = useState('{}');
      const [files, setFiles] = useState([{Graph_Name:"", keep_triples:[], narration:"",entity_ref_dict:{}}]);
      const [title, setTitle] = useState("");
      const [selectedNodes, setSelectedNodes] = useState([]);
      const handleChange = (e) => {
        const value = e.target.value;
        setsentence(value
          );
      }
      const onSelectionChange = ({nodes, edges}) => {
        console.log(nodes)
        setSelectedNodes(nodes)
      };
      const onSelectionStart = () =>{
        console.log("reached")
      }
      const onSelectionEnd = () =>{
        console.log("reached")
        console.log(selectedNodes)
      }
      const updateFile = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setsentence(value
          );
      }
      return (
      
        <div className = "app" style={{marginBottom:"15px", marginTop:"20px", paddingLeft: '50px', paddingRight: '50px'}}>
          
          
          <div align='left' className="appinfo">
          <h5>Welcome to the KGTeller visualizer, a service to easily annotate knowledge graphs and text.</h5>
            <h6>
              In order to upload preexisting knowledge graphs, they must be in a json file in the following form below:
            </h6>
            <code>
            {'[{'}"Graph_Name": "title", "keep_triples":[["source","label","target"]...], "narration": "text", "entity_ref_dict: {'{'}{"\"<entity_0>\": \"entity\""}...{'}]'}
            </code> 
          <br></br>
          <br></br>
            <h6>For example:</h6>
            <code>
            {"[{\"Graph_Name\":\"Example\",\"keep_triples\":[[\"test\",\"edge\",\"entity\"],[\"test\",\"is_a\",\"example\"]],\"narration\":\"This is a <entity_0> <entity_1> to see what an <entity_2> is\",\"entity_ref_dict\":{\"<entity_0>\":\"test\",\"<entity_1>\":\"example\",\"<entity_2>\":\"entity\"}}]"}
            </code>
          </div>

            <Row>
            <FileStuff elements={nodes} edges={edges} setEdges={setEdges} sentence={sentence} fileindex={fileindex} setfileindex={setfileindex} files={files} setFiles={setFiles} cm={cm} title={title} colors={colors}/>
          </Row>

          <div align='center'>
            {fileindex>=0&&<h2>File Table of Contents</h2>}
          {fileindex>=0&&<TOC files={files} setFiles={setFiles} fileindex={fileindex} setfileindex={setfileindex} cm={cm} setcm ={setcm} edges={edges} 
                                sentence = {sentence} title={title}  colors={colors}/>}
          {<h1 style={{right:450}}>{title}</h1>}
          </div>
          <div align='center'>
              {sentence&&<TextDisplay sentence={sentence}
              onChange={handleChange}
              colors={colors}
              updateFile={updateFile}/>}
          </div>
        <Container>
        
          <Row style={{height:600}}>
            
            {files&&<Col style={{border: '2px solid rgba(0, 0, 0, 0.05)', 
                                  overflowY: 'auto',
                                  maxHeight:600
                                  }}>
            {files&&<h3>Input JSON</h3>}
            <ReactJson src={JSON.parse(json)}/>
            </Col>}
            <Col style={{border: '2px solid rgba(0, 0, 0, 0.05)'}}>
            <ReactFlow
          edgeTypes={edgeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onSelectionChange={onSelectionChange}
          selectionDrag={true}
          fitView
        >
          <Controls />
    
        </ReactFlow>
            </Col>
          </Row>
            <Row>
              <Col xs={10}>
              <Form elements={nodes} setElements={setNodes} edges={edges} setEdges={setEdges} sentence={sentence} setsentence={setsentence}
              setcolors={setcolors} setjson={setjson} fileindex={fileindex} setfileindex={setfileindex} files={files} setFiles={setFiles} setTitle={setTitle} cm={cm} setcm={setcm} selectedNodes = {selectedNodes}/>
              </Col>
              <Col>
              <Changefileindex files={files} setFiles={setFiles} fileindex={fileindex} setfileindex={setfileindex} cm={cm} setcm ={setcm} edges={edges} 
                                sentence = {sentence} title={title}  colors={colors} elements={nodes}/>
              </Col>
            </Row>
            
          </Container>
        
        </div>
    
        
        
      );
    };
    
    export default OverviewFlow;
    