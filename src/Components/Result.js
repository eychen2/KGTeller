import React, { useState } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const getColor = (colors, index) => {
    return colors[index];
  }
const ColorPara = (props, colors) => {
    var i=0;
    return (
      <div style={{overflowY: 'auto',
      maxHeight:150, width: 210}}>
        {props.children.split(' ').map(text => {
          return (
            <div style={{ color: getColor(props.colors, i++), display: 'inline'}}>
              {text} &nbsp;
            </div>
          )
        })}
      </div>
    )
  }
export default function Result({preds, index, onChange, colors,updateFile}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = () => {
    setIsEditing(true);
    console.log(preds)
  };

  const handleKeyPress = e => {
    if (e.key === "Enter"&&preds[index].length>0) {
      setIsEditing(false);
    }
  };

  return (
    <>
      {isEditing ? (
        <input
          autoFocus
          value={preds}
          onChange={onChange}
          onKeyDown={handleKeyPress}
          type="text"
        />
      ) : (
        <Row >
          <Col xs={7}>
          <ColorPara colors={colors}>{preds}</ColorPara>
          </Col>
          <Col xs={2}>
          <button onClick={handleClick}>Edit</button>
          </Col>
          <Col xs={1}>
          <button onClick={updateFile} value = {index} className="submitButton" type="submit" > Update</button>
          </Col>
          <hr class="mb-24"/>
	</Row>
      )}
    </>
  );
}
