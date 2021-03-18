import React from 'react';
import HomeTemplate from 'templates/homeTemplate';
import Header from 'organisms/Header';
import Footer from 'organisms/Footer';
import SignIn from 'organisms/SignInForm';

function HomePage() {
    return <HomeTemplate
                header = {<Header />}
                footer = {<Footer />}
                content = {<SignIn />}
           />
}

export default HomePage;