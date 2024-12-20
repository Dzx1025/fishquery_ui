import Navbar from '@/components/Navbar';
import {AuthProvider} from '@/contexts/AuthContext';
import RulesQueryContent from '@/components/RulesQueryContent';
import {Suspense} from 'react';

export default function RulesQuery() {
    return (
        <AuthProvider>
            <Navbar/>
            <Suspense fallback={<div>Loading content...</div>}>
                <RulesQueryContent/>
            </Suspense>
        </AuthProvider>
    );
}
