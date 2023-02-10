import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const getColor = (colors, index) => {
    return colors[index];
  }

const ColorPara = (props) => {
    var i=0;
    return (
      <div style={{overflowY: 'auto',
      maxHeight:210, width: 100+"%"}}>
        {props.children.split('').map(text => {
          return (
            <div style={{ color: getColor(props.colors, i++), display: 'inline'}}>
              {text}
            </div>
          )
        })}
      </div>
    )
  }

export default function Result({preds, index, counts, onChange, colors,updateFile}) {
  const [isEditing, setIsEditing] = useState(false);
  const handleClick = () => {
    setIsEditing(true);
  };

  const handleKeyPress = e => {
    if (e.key === "Enter"&&preds[index].length>0) {
      setIsEditing(false);
    }
  };

  return (
    <>
      {isEditing ? (
       <Row >
          <Col xs={9}>
            <textarea
              autoFocus
              value={preds}
              onChange={onChange}
              onKeyDown={handleKeyPress}
              type="text"
              style={{height: 210, width: 100+'%'}}
            />
          </Col>
          <Col xs={1}>
            <Button onClick={e => {updateFile(e); setIsEditing(false);}} variant="success" value = {index} className="submitButton" type="submit" >Update</Button>
</Col>
       </Row>
      ) : (
        <Row >
          <Col xs={9}>
            <ColorPara colors={colors} counts={counts}>{preds}</ColorPara>
          </Col>
         
          <Col xs={1}>
          <Button onClick={handleClick} variant="info">Edit</Button>
          
          </Col>
          <hr class="mb-24"/>
	</Row>
      )}
    </>
  );
}
