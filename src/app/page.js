'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Volume2, VolumeX, Power, ChevronUp, ChevronDown } from 'lucide-react';

const SVD_ADDRESS = '10.231.4.6';
const API_BASE_URL = `https://${SVD_ADDRESS}/sv-openapi/ws/rest/localcontrol`;

export default function Home() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [volume, setVolume] = useState(50);
  const [status, setStatus] = useState('');

  const channels = {
    "0": "HDMI-In", "1": "TEN BOLD", "10": "TEN HD", "11": "TEN PEACH",
    "21": "ABC HD", "22": "ABC KIDS", "23": "ABC ME", "24": "ABC NEWS",
    "30": "SBS ONE HD", "32": "SBS VICELAND HD"
  };

  const makeApiCall = async (endpoint, method = 'GET', data = null) => {
    try {
      const url = `${API_BASE_URL}/${endpoint}`;
      const options = {
        method,
        headers: {
          'Authorization': `Basic ${btoa(`${pin}:`)}`,
          'Content-Type': 'application/xml'
        }
      };
      if (data) options.body = data;
      const response = await fetch(url, options);
      return await response.text();
    } catch (error) {
      return `Error: ${error.message}`;
    }
  };

  // In page.js, update the handleLogin function
const handleLogin = async () => {
    try {
      setStatus('Logging in...');
      const result = await makeApiCall('config/player');
      
      if (result.includes('Error')) {
        setStatus('Login failed. Check your PIN.');
        return;
      }
      
      setIsAuthenticated(true);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(result, 'text/xml');
      const playerNodes = xmlDoc.querySelectorAll('player');
      const playersList = Array.from(playerNodes).map(player => ({
        id: player.querySelector('id').textContent,
        name: player.querySelector('name').textContent
      }));
      setPlayers(playersList);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };
  
  const togglePlayer = (playerId) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handlePower = async (state) => {
    if (selectedPlayers.length === 0) return;
    
    await Promise.all(
      selectedPlayers.map(playerId =>
        makeApiCall(`control/player/power/${state}/${playerId}`)
      )
    );
    setStatus(`Power ${state}`);
  };

  const handleVolume = async (newVolume) => {
    setVolume(newVolume);
    if (selectedPlayers.length === 0) return;
    
    await Promise.all(
      selectedPlayers.map(playerId =>
        makeApiCall(`control/player/volume/${newVolume}/${playerId}`)
      )
    );
  };

  const changeChannel = async (channel) => {
    if (selectedPlayers.length === 0) {
      setStatus('Please select a player first');
      return;
    }

    await Promise.all(
      selectedPlayers.map(playerId =>
        makeApiCall(`control/player/channel/${channel}/${playerId}`)
      )
    );
    setStatus(`Changed to ${channels[channel] || channel}`);
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
          <Button onClick={handleLogin} className="w-full">Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card className="p-6">
        <h1 className="mb-6 text-2xl font-bold">TV Channel Control</h1>
        
        <div className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">Select Players</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {players.map(player => (
              <Button
                key={player.id}
                variant={selectedPlayers.includes(player.id) ? "default" : "outline"}
                onClick={() => togglePlayer(player.id)}
              >
                {player.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <Button onClick={() => handlePower('on')} className="flex items-center gap-2">
              <Power /> On
            </Button>
            <Button onClick={() => handlePower('off')} className="flex items-center gap-2">
              <Power /> Off
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <VolumeX />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolume(e.target.value)}
              className="w-full"
            />
            <Volume2 />
          </div>

          <div className="flex gap-4 mb-4">
            <Button onClick={() => changeChannel('up')} className="flex items-center gap-2">
              <ChevronUp /> Channel Up
            </Button>
            <Button onClick={() => changeChannel('down')} className="flex items-center gap-2">
              <ChevronDown /> Channel Down
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(channels).map(([number, name]) => (
            <Button
              key={number}
              variant="outline"
              onClick={() => changeChannel(number)}
              className="h-20 whitespace-normal text-sm"
            >
              {name}
            </Button>
          ))}
        </div>

        {status && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>{status}</p>
          </div>
        )}
      </Card>
    </div>
  );
}