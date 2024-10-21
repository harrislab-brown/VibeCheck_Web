// src/components/SerialConnect.tsx
import React, { useState } from 'react';
import { RootState } from '../redux/store';
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { connectSerial, disconnectSerial } from '../features/serialSlice';
import '../styles/SerialConnect.css';

const SerialConnect: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isConnected, isBrowserCompatible } = useAppSelector((state: RootState) => state.serial);
    const [baudRate] = useState(115200);

    const toggleSerialConnection = async () => {
        if (isConnected) {
            await dispatch(disconnectSerial());
        } else {
            await dispatch(connectSerial(baudRate));
        }
    };

    const getButtonText = () => {
        if (!isBrowserCompatible) return "Browser not compatible";
        return isConnected ? 'Disconnect' : 'Connect to VibeCheck';
    };

    const getButtonClass = () => {
        if (!isBrowserCompatible) return 'serial-connect-button incompatible';
        if (isConnected) return 'serial-connect-button connected';
        return 'serial-connect-button disconnected';
    };

    return (
        <div className = "serial-connect-button">
            <div 
                className={getButtonClass()}
                onClick={isBrowserCompatible ? toggleSerialConnection : undefined}
            >
                {getButtonText()}
            </div>
        </div>
    );
};

export default SerialConnect;