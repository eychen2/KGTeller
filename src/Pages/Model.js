import React from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
const Model = () =>{
    const fileRead = e => {
        e.preventDefault();
        var filereader=new FileReader();
        filereader.readAsText(e.target.files[0], "UTF-8");
        filereader.onload = e => {
            console.log(JSON.parse(e.target.result));
        }; 
    }
    const modelSelect = e => {
        e.preventDefault();
        console.log(e.target.value)

    }
    const getPred = e => {
        e.preventDefault()
        console.log("Reached")
    }
    return(
        <div className='app'>
            <div>
                <h1>Model</h1>
                <p>You can use this page to upload data and see what the model outputs</p> 
            </div>
            <div>
                <Form.Select aria-label="Model chooser" onChange={modelSelect}>
                    <option value="-1">Select Model</option>
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
                <Form>
                    <Button variant="primary" type="submit" onClick={getPred}>
                     Predict
                    </Button>
                </Form>
            </div>
        </div>
    );
}
export default Model;