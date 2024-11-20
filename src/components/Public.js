import React from 'react'
import {Link} from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">Axil Repairs!</span></h1>
            </header>
            <main className="public__main">
                <p>Located in Amreli City.</p>
                <address className="public__addr">
                   Axil Repairs<br />
                    Amreli,Gujarat<br />
                    Pincode:365601<br />
                    
                </address>
                <br />
                <p>Owner: Axil Nakrani</p>
            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>

    )
    return content
}
export default Public
