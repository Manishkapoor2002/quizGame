import { useRecoilValue } from 'recoil'
import { authState } from '../store/userAtom'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const userAuthState = useRecoilValue(authState)
  const navigate = useNavigate();
  if (!userAuthState) {
    navigate('/login');
    return;
  }

  return (
    <div>
      Hello
    </div>
  )
}

export default Home
