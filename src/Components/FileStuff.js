import React, {useEffect, useState} from 'react';
import download from 'downloadjs';
import Form from 'react-bootstrap/Form';
const FileStuff=({elements, edges, sentence, fileindex, setfileindex, files, setFiles, cm, title, colors}) =>{
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
        /*
        var filestring = "[{"
        filestring+="\"Event Name\": \""+title+"\","
        filestring+="\"keep_triples\": ["
        for (const x in edges)
        {
            console.log(edges[x])
            const labels =edges[x].label.split(", ")
            for(var i =0; i<labels.length;++i)
            {
                filestring+="[\""+edges[x].source+"\", \""+labels[i]+"\", \""+edges[x].target+"\"], "
            }

        }
        filestring=filestring.slice(0,-2)
        filestring+="], "
        filestring+="\"narration\": \""
        const store = sentence.split(" ")
        var cheese = ""
        var entity=0
        var index=0
        console.log(cm)
        while(index<colors.length)
        {
            if(colors[index]==='black')
            {
                
                filestring+=store[index]+" "
                ++index
            }
            else
            {
                const color = colors[index]
                while(colors[index]===color)
                {
                    ++index
                }
                console.log(color)
                cheese+="\"<entity_"+entity.toString()+">\": \""+cm.get(color)+"\", "
                filestring+="<entity_"+entity.toString()+"> "
                ++entity
            }
        }
        filestring=filestring.slice(0,-1)
        cheese=cheese.slice(0,-2)
        filestring+="\", \"entity_ref_dict\": {"
        filestring+=cheese+"}"
        filestring+="}]"*/
        saveCurrent()
        let filestring=JSON.stringify(files)
        download(filestring,"data.json","text/plain");
    }
    const saveCurrent = () =>{
        console.log(files)
        var temp=files[fileindex]
        console.log(temp)
        temp.Event_Name=title
        var tempedges=[]
        for (const x in edges)
        {
            const labels =edges[x].label.split(", ")
            for(var i =0; i<labels.length;++i)
            {
                tempedges.push([edges[x].source,labels[i],edges[x].target])
            }

        }
        temp.keep_triples=tempedges
        const store = sentence.split(" ")
        var entity=0
        var index=0
        var filestring=""
        while(index<colors.length)
        {
            if(colors[index]==='black')
            {
                
                filestring+=store[index]+" "
                ++index
            }   
            else
            {
                const color = colors[index]
                while(colors[index]===color)
                {
                    ++index
                }
                temp.entity_ref_dict["<entity_"+entity.toString()+">"]= cm.get(color)
                filestring+="<entity_"+entity.toString()+"> "
                ++entity
            }
        }
        filestring=filestring.slice(0,-1)
        temp.narration=filestring
        files[fileindex]=temp
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