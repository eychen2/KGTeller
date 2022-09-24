import React, {useEffect, useState} from 'react';
const TOC = ({files, fileindex, setfileindex})=>{
    const [used,setUsed]=useState(false);
    const handleChange= (e) =>{
        e.preventDefault()
        console.log(e.target.value)
        if(e.target.value!==-1)
        {
            setfileindex(e.target.value)
        }
        setUsed(true);
    };
    return(
        <form>
            <label>
                <select id="graphlist" onChange={handleChange}>
                    {!used&&<option value={-1}>
                        Select which graph you want to render from the file
                    </option>}
                    {Object.entries(files).map((key, value) => {
                        return <option value={value}>{key[1].title}</option>;
                })}
                </select>
            </label>
        </form>
    )
}
export default TOC;