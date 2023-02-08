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
        let temp = files
        temp[fileindex].Graph_Name=title
       
        var tempedges=[]
        for (const x in edges)
        {
            const labels =edges[x].label.split(", ")
            for(var i =0; i<labels.length;++i)
            {
                tempedges.push([edges[x].source,labels[i],edges[x].target])
            }

        }
        temp[fileindex].keep_triples=tempedges
        const store = sentence.split(" ")
        var entity=0
        var index=0
        var newText=""
        let ref_dict={}
        const myMap = new Map()
        const mySet= new Set()
        while(index<colors.length)
        {
            if(colors[index]==='black')
            {
                
                newText+=store[index]+" "
                ++index
            }   
            else
            {
                const color = colors[index]
                if(cm.get(color).indexOf(' ') >= 0)
                {
                    while(colors[index]===color)
                    {
                        ++index
                    }
                }
                else
                {
                    ++index
                }
                if(myMap.has(color))
                {
                    newText+=myMap.get(color)
                    if('.!?,\"'.indexOf(store[index-1].slice(-1)) >= 0)
                        newText+=store[index-1].slice(-1)
                    newText+=" "
                }
                else
                {
                myMap.set(color,"<entity_"+entity.toString()+">")
                mySet.add(cm.get(color))
                ref_dict["<entity_"+entity.toString()+">"]= cm.get(color)
                newText+="<entity_"+entity.toString()+">"
                if('.!?,\"'.indexOf(store[index-1].slice(-1)) >= 0)
                    newText+=store[index-1].slice(-1)
                newText+=" "
                ++entity
                }
            }
        }
        for(const x of elements)
        {
            if(!mySet.has(x.id))
                {
                    ref_dict["<entity_"+entity.toString()+">"]= x.id
                    ++entity
                }
        }
        newText=newText.slice(0,-1)
        temp[fileindex].entity_ref_dict=ref_dict
        temp[fileindex].narration=newText
        setFiles(temp)
        console.log(temp)
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