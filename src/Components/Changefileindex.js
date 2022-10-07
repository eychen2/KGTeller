import {Button} from 'react-bootstrap'
const Changefileindex = ({files, fileindex, setfileindex})=>{
    const goPrevious= (e) =>{
        e.preventDefault()
        if(fileindex>0)
            setfileindex(fileindex-1);

    };
    const goNext= (e) =>{
        e.preventDefault()
        if(fileindex<files.length-1)
            setfileindex(fileindex+1);
    };
    return(
        <form>
            <div>
                {fileindex>0&&<Button onClick={goPrevious} className="submitButton" type="submit" style={{position:'absolute', right:450}}>Previous</Button>}
                {fileindex<files.length-1&&<Button onClick={goNext} className="submitButton" type="submit" style={{position:'absolute', right:400}}>Next</Button>}
            </div>
                
        </form>
    )
}
export default Changefileindex;