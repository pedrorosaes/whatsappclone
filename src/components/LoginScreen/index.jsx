import {Api} from '../../api/api';

import './style.css';

export  function LoginScreen({onReceive}) {

    async function handleFacebookLogin() {
       let result = await Api.fbPopup();

        if(result) {
            onReceive(result.user);
        } else {
            alert("Erro!");
        }
    }

    return (
        <div className="login">
            <button onClick={handleFacebookLogin}>Logar com Facebook</button>
        </div>
        );
}