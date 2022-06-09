import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import './App.css';
import { Button, Grid } from '@mui/material';
import { getDifference, exampleCurrentSchema, exampleNextSchema } from './diff';

function App() {

  const [currentSchema, setCurrentSchema] = useState(exampleCurrentSchema);
  const [nextSchema, setNextSchema] = useState(exampleNextSchema);
  const [result, setResult] = useState([]);

  const handleCurrentSchemaChange = (event: any) => {
    setCurrentSchema(event.target.value);
  }

  const handleNextSchemaChange = (event: any) => {
    setNextSchema(event.target.value);
  }

  const handleClick = async () => {
    const difference = await getDifference(currentSchema, nextSchema);
    setResult(difference);
  }

  return (
    <div className="App" style={{margin: "10px 10%"}}>
      <Grid container spacing={2} maxWidth="lg">
        <Grid item xs={6}>
          <TextField fullWidth
              id="outlined-textarea"
              label="Current Schema"
              placeholder="Schema"
              defaultValue={exampleCurrentSchema}
              onChange={handleCurrentSchemaChange}
              multiline
              maxRows={15}
            />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth
              id="outlined-textarea"
              label="New Schema"
              placeholder="Schema"
              defaultValue={exampleNextSchema}
              onChange={handleNextSchemaChange}
              multiline
              maxRows={15}
            />
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" onClick={handleClick}>Check</Button>
        </Grid>
        <Grid item xs={12}>
          <div style={{textAlign: "left"}}>
            { 
              result.map((item: any) => 
                <div style={{ color: (item.criticality.level === "NON_BREAKING" ? "#33FF66" : (item.criticality.level === "BREAKING" ? "#FF6633" : "#CCCC33" )) }}>
                  [{item.criticality.level}] - {item.message}
                </div>
              ) 
            }
          </div>
        </Grid>
      </Grid>
      
    </div>
  );
}

export default App;
