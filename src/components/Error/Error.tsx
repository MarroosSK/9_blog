import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Error = () => {
    const navigate = useNavigate()
  return (
    <div>
        <h2>Page not Found</h2>
        <Button onClick={() => navigate("/")}>return</Button>
    </div>
  )
}

export default Error;