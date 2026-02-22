import React from 'react';
import IlanForm from '../components/IlanForm';
import { useNavigate } from 'react-router-dom';

function IlanVer({ kullanici, ilanlariGetir }) {
    const navigate = useNavigate();

    if (!kullanici) {
        return (
            <div className="form-container">
                <p>İlan vermek için giriş yapmalısın!</p>
            </div>
        );
    }

    return (
        <IlanForm
            kullanici={kullanici}
            onIlanEklendi={() => {
                ilanlariGetir();
                navigate('/');
            }}
        />
    );
}

export default IlanVer;