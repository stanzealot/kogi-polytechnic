import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import PageWrapper from '@/components/shared/PageWrapper';

const App = () => {
  return (
    <BrowserRouter>
      <PageWrapper>
        <AppRoutes />
      </PageWrapper>
    </BrowserRouter>
  );
};

export default App;
