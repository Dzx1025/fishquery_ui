import Navbar from '@/components/Navbar';
import {AuthProvider} from '@/contexts/AuthContext';

export default function SpeciesLookup() {
    return (
        <AuthProvider>
            <Navbar/>
            <main>
                <h1>Species Lookup</h1>
            </main>
        </AuthProvider>
    );
}
