import Navbar from '@/components/Navbar';
import {AuthProvider} from '@/contexts/AuthContext';

export default function RulesQuery() {
    return (
        <AuthProvider>
            <Navbar/>
            <main>
                <h1>Rules Query</h1>
            </main>
        </AuthProvider>
    );
}