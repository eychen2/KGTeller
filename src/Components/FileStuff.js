import React, {useEffect, useState} from 'react';
import download from 'downloadjs';
import Form from 'react-bootstrap/Form';
const FileStuff=({elements, setElements, edges, sentence, setsentence, setjson, fileindex, setfileindex, files, setFiles}) =>{
    const [filereader, setfilereader] = useState(new FileReader());
    const fileRead = e => {
        filereader.readAsText(e.target.files[0], "UTF-8");
        setfileindex(0);
    }
    useEffect(()=> {
        filereader.onload = e => {
            setFiles(JSON.parse(e.target.result));
        }; 
    },[filereader]);
    const saveFile = (e) =>{
        e.preventDefault();
        var tempnodes=[];
        var tempedges=[];
        for(var i=0; i<elements.length;++i)
            tempnodes.push(elements[i].id);
        for(var i=0; i<edges.length;++i)
            tempedges.push({source: edges[i].source, target: edges[i].target, label: edges[i].label})
        var tempjson = {nodes: tempnodes, edges: tempedges, text: sentence}
        var filestring= JSON.stringify(tempjson)
        download('['+filestring+']',"data.json","text/plain");
    }
    return(
        <div>
            <Form>
                <Form.Group controlId="formFile" className="mb-3" onChange={fileRead}>
                <Form.Label>Choose a file to load</Form.Label>
                <Form.Control type="file" />
                </Form.Group>
            </Form>
            <button onClick={saveFile} className="submitButton" type="submit" >Save File</button>
        </div>
    )
}
export default FileStuff;