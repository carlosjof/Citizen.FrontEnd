import { QueryClient, QueryClientProvider } from "react-query";
import useAuthStore from "./utils/store/authStore";
import Dashboard from "./components/Dashboard/Dashboard";
import LoginForm from "./components/Login/LoginForm";

const queryClient = new QueryClient();

export default function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        {token ? <Dashboard /> : <LoginForm />}
      </div>
    </QueryClientProvider>
  );  
}