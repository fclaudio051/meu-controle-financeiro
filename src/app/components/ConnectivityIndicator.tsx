// Substitua o conteúdo do arquivo src/app/components/ConnectivityIndicator.tsx por este:

'use client';

import { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { apiService } from '../services/api';

export function ConnectivityIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [isServerAvailable, setIsServerAvailable] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    // Verificar conectividade inicial
    checkConnectivity();

    // Verificar conectividade periodicamente
    const interval = setInterval(checkConnectivity, 30000); // 30 segundos

    // Event listeners para mudanças de conectividade
    const handleOnline = () => {
      setIsOnline(true);
      checkConnectivity();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsServerAvailable(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkConnectivity = async () => {
    if (!navigator.onLine) {
      setIsOnline(false);
      setIsServerAvailable(false);
      return;
    }

    setIsOnline(true);
    
    try {
      const response = await apiService.healthCheck();
      setIsServerAvailable(response.success);
      setLastCheck(new Date());
    } catch {
      setIsServerAvailable(false);
      setLastCheck(new Date());
    }
  };

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: FaTimes, // Substituído FaWifiSlash por FaTimes
        text: 'Sem Conexão',
        color: 'bg-red-100 text-red-800 border-red-200',
        bgColor: 'bg-red-500'
      };
    }

    if (!isServerAvailable) {
      return {
        icon: FaExclamationTriangle,
        text: 'Servidor Offline',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        bgColor: 'bg-amber-500'
      };
    }

    return {
      icon: FaCheckCircle,
      text: 'Online',
      color: 'bg-green-100 text-green-800 border-green-200',
      bgColor: 'bg-green-500'
    };
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium shadow-lg backdrop-blur-md ${status.color}`}>
        <div className={`w-2 h-2 rounded-full ${status.bgColor} animate-pulse`}></div>
        <StatusIcon className="w-4 h-4" />
        <span>{status.text}</span>
      </div>
      
      {lastCheck && (
        <div className="text-xs text-gray-500 text-center mt-1">
          Última verificação: {lastCheck.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}