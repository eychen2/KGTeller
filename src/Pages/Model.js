import React, {useState}from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import TOC from '../Components/TOC'
const Model = () =>{
    const [files, setFiles] = useState("");
    const [prediction, setPrediction] = useState(null);
    const [fileindex,setfileindex]= useState(0);
    const [used,setUsed]= useState(false);
    const fileRead = e => {
        e.preventDefault();
        var filereader=new FileReader();
        filereader.readAsText(e.target.files[0], "UTF-8");
        filereader.onload = e => {
            setFiles(JSON.parse(e.target.result));
        }; 
        setUsed(false)
    }
    const modelSelect = e => {
        e.preventDefault();
        console.log(e.target.value)
        console.log(prediction)
        setUsed(true)
    }
    const getPred = async e => {
        e.preventDefault()
        console.log("Reached")
        axios.post("/predict",
        {
            data:JSON.stringify(files[fileindex])
        })
        .then(function (response) {
            setPrediction(response['data']['data']);
          })
    }
    return(
        <div className='app'>
            <div>
                <h1>Model</h1>
                <p>You can use this page to upload data and see what the model outputs</p> 
            </div>
            <div>
                <Form.Select aria-label="Model chooser" onChange={modelSelect}>
                    {!used&&<option value="-1">Select Model</option>}
                    <option value="1">Model 1</option>
                    <option value="2">Model 2</option>
                    <option value="3">Model 3</option>
                </Form.Select>
                <Form>
                    <Form.Group controlId="formFile" className="mb-3" onChange={fileRead}>
                    <Form.Label>Default file input example</Form.Label>
                    <Form.Control type="file" />
                    </Form.Group>
                </Form>
                {files&&<TOC files={files} fileindex={fileindex} setfileindex={setfileindex}></TOC>}
                <Form>
                    <Button variant="primary" type="submit" onClick={getPred}>
                     Predict
                    </Button>
                </Form>
                {prediction&& <h2> The prediction is: {prediction}</h2>}
            </div>
        </div>
    );
}
export default Model;