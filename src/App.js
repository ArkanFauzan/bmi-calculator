import {useEffect, useState} from 'react'
import {Row, Col, Button, FormFeedback, Input, Label, Container} from 'reactstrap'
import './App.css';
import axios from 'axios'

import chart from './assets/img/chart.png'
import pinIcon from './assets/img/pin-icon.png'

const apiUrl = "https://bmi-calculator-simple.herokuapp.com/bmi"

function App() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [err, setErr] = useState({
    height: false,
    weight: false
  })
  const [dataBmi, setDataBmi] = useState({
    name: '',
    height: '',
    weight: '',
    bmi: "",
    bmiCategory: ''
  })
  // for bmi pin position based on bmi value
  const [positionBmiPin, setPositionBmiPin] = useState(0);

  useEffect(()=>{
    const errHeight = (height.length>=0 && `${height*1}`==='NaN' ) || height[0]==='.' ? true : false;
    
    setErr({
      height: errHeight,
      weight: err.weight
    })
  },[height])

  useEffect(()=>{
    const errWeight = (weight.length>=0 && `${weight*1}`==='NaN') || weight[0]==='.' ? true : false;
    
    setErr({
      height: err.height,
      weight: errWeight
    })
  },[weight])

  useEffect(()=>{
    // set the margin left of BMI pin to adjust with BMI bar
    // 1 bmi is equal to 33.652 px margin left
    // bmi<=16.2 , margin = 0 px
    // bmi>=32.5, margin = 548.5 px
    if(dataBmi.bmi <= 16.2){
      setPositionBmiPin(0);
    }
    else if(dataBmi.bmi >= 32.5){
      setPositionBmiPin(548.5)
    }
    else{
      let differenceBmi = dataBmi.bmi - 16.2;
      setPositionBmiPin((differenceBmi*33.652)+1)
    }
  },[dataBmi])

  const handleSubmit= async()=>{
    const errHeight = height.length===0 ? true : false;
    const errWeight = weight.length===0 ? true : false;

    if(errWeight || errHeight){
      setErr({
        height:errHeight,
        weight:errWeight
      })
      return 
    }

    const data = {
      name: "Your BMI",
      height: height,
      weight: weight
    }

    const result = await axios.post(apiUrl, data)
    setDataBmi(result.data);
  }

  return (
    <Container id="container">
      <h1 style={{textAlign:"center",margin:"50px"}}>BMI Calculator</h1>
      <Row>
        <Col md="6" sm={12} className="mb-3">
          <Col sm="10">
            <Row className="py-2">
              <Label>Height (in cm)</Label><br/>
              <Input 
                  type="text" 
                  onChange={(e)=>setHeight(e.target.value)} 
                  value={height} 
                  invalid={err.height}
              />
              <FormFeedback>{err.height && 'Must number'}</FormFeedback>
            </Row>
            <Row className="py-2">
              <Label>Weight (in kg)</Label><br/>
              <Input 
                  type="text" 
                  onChange={(e)=>setWeight(e.target.value)} 
                  value={weight} 
                  invalid={err.weight}
              />
              <FormFeedback>{err.weight && 'Must Number'}</FormFeedback>
            </Row>
            <Row className="py-2">
              <Button color="primary" className="btn-submit" onClick={()=>{if(!err.height && !err.weight) return handleSubmit()}}>Calculate</Button>
            </Row>
          </Col>
        </Col>
        <Col md="6" sm={12}>
          <table className="table table-stripped">
            <tbody>
              <tr>
                <td style={{width:'30%'}}>Your Height </td><td> : {dataBmi.height ? dataBmi.height : '-'} cm</td>
              </tr>
              <tr>
                <td>Your Weight </td><td> : {dataBmi.weight ? dataBmi.weight : '-'} kg</td>
              </tr>
              <tr>
                <td>Your BMI</td><td> : {dataBmi.bmi ? (`${dataBmi.bmi} (${dataBmi.bmiCategory})`) : '-'}</td>
              </tr>
            </tbody>
          </table>
        </Col>

        <Col sm="12" className="mt-5">
          {dataBmi.name!=='' && 
            <div className="chart-container">
              <div className="icon-chart" style={{left:`${positionBmiPin}px`}}>
                <h2 className="bmi-icon">{dataBmi.bmi && dataBmi.bmi}</h2>
                <img src={pinIcon} width="50px" alt="Arrow BMI" />
              </div>
              <img src={chart} width="600px" alt="BMI Chart Bar"></img>
            </div>
          }
        </Col>
      </Row>
    </Container>
  );
}

export default App;
