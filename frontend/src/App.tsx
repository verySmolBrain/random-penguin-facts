// import { useState } from 'react'
import './App.css'
import { ThemeProvider, Typography } from '@mui/material'
import theme from './theme/theme';
import { useYourOutput } from './components/Penguins';

function App() {
    // const [count, setCount] = useState(0)
    const penguin_fact = useYourOutput()

    return (
        <ThemeProvider theme = { theme }>
            <Typography>
                { penguin_fact ? penguin_fact : 'Loading...' }
            </Typography>
        </ThemeProvider>
    )
}

export default App
