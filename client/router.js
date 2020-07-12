import Admin from './pages/Admin';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

export default function () {
  console.log(window.history);
  console.log(window.location);
  if (window.history.state) {
    console.log('from previous page');
  } else {
    console.log('from new window');
  }
}
