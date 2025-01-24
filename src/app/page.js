'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Volume2, Power } from 'lucide-react';

export default function Home() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [volume, setVolume] = useState(50);

  const channels = {
    "0": "HDMI-In", 
    "1": "TEN BOLD", 
    "10": "TEN HD",
    "21": "ABC HD",
    "30": "SBS ONE HD"
  };

  const handleLogin = () => {
    if (pin) {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <h2 className="mb-4 text-2xl font-bold">TV Control Login</h2>
          <Input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card className="p-6">
        <h1 className="mb-6 text-2xl font-bold">TV Channel Control</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(channels).map(([number, name]) => (
            <Button
              key={number}
              variant="outline"
              className="h-20 whitespace-normal text-sm"
            >
              {name}
            </Button>
          ))}
        </div>

        <div className="flex gap-4">
          <Button className="flex items-center gap-2">
            <Power /> Power
          </Button>
          <Button className="flex items-center gap-2">
            <Volume2 /> Mute
          </Button>
        </div>
      </Card>
    </div>
  );
}