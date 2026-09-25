import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageEffects from './components/PageEffects';

export const metadata = { title: 'Dilip Kumar — Senior Engineer', description: 'Dilip Kumar — Senior Engineer building scalable software systems.' };
export default function RootLayout({ children }) { return <html lang="en"><body><PageEffects /><Navbar />{children}<Footer /></body></html>; }
