import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "./ImageUpload";
import { TeamConstraints } from "./TeamConstraints";
import { Search, Plus, Upload, Edit3 } from "lucide-react";

// Expanded mock player database with real FPL players
const mockPlayerDatabase = [
  // Goalkeepers
  { id: 1, name: "Alisson", team: "LIV", position: "GKP", price: 5.5 },
  { id: 2, name: "Ederson", team: "MCI", position: "GKP", price: 5.0 },
  { id: 3, name: "Ramsdale", team: "ARS", position: "GKP", price: 4.5 },
  { id: 4, name: "Pope", team: "NEW", position: "GKP", price: 5.0 },
  { id: 5, name: "Pickford", team: "EVE", position: "GKP", price: 4.5 },
  { id: 60, name: "Henderson", team: "CHE", position: "GKP", price: 4.0 },
  { id: 61, name: "Vicario", team: "BUR", position: "GKP", price: 4.5 },
  
  // Defenders
  { id: 6, name: "Virgil van Dijk", team: "LIV", position: "DEF", price: 6.5 },
  { id: 7, name: "Ruben Dias", team: "MCI", position: "DEF", price: 6.0 },
  { id: 8, name: "William Saliba", team: "ARS", position: "DEF", price: 5.5 },
  { id: 9, name: "Kieran Trippier", team: "NEW", position: "DEF", price: 5.5 },
  { id: 10, name: "Reece James", team: "CHE", position: "DEF", price: 6.0 },
  { id: 11, name: "Andrew Robertson", team: "LIV", position: "DEF", price: 6.0 },
  { id: 12, name: "Kyle Walker", team: "MCI", position: "DEF", price: 5.5 },
  { id: 13, name: "Gabriel", team: "ARS", position: "DEF", price: 5.0 },
  { id: 14, name: "Sven Botman", team: "NEW", position: "DEF", price: 4.5 },
  { id: 15, name: "Ben Chilwell", team: "CHE", position: "DEF", price: 5.0 },
  { id: 62, name: "A.Murphy", team: "AVL", position: "DEF", price: 4.5 },
  { id: 63, name: "Bogarde", team: "NEW", position: "DEF", price: 4.5 },
  { id: 64, name: "Gusto", team: "CRY", position: "DEF", price: 5.0 },
  { id: 65, name: "Ballard", team: "WHU", position: "DEF", price: 4.5 },
  { id: 66, name: "Gvardiol", team: "WOL", position: "DEF", price: 5.5 },
  
  // Midfielders
  { id: 16, name: "Mohamed Salah", team: "LIV", position: "MID", price: 12.5 },
  { id: 17, name: "Kevin De Bruyne", team: "MCI", position: "MID", price: 10.5 },
  { id: 18, name: "Bukayo Saka", team: "ARS", position: "MID", price: 9.0 },
  { id: 19, name: "Bruno Fernandes", team: "MUN", position: "MID", price: 8.5 },
  { id: 20, name: "Son Heung-min", team: "TOT", position: "MID", price: 9.5 },
  { id: 21, name: "Luis Diaz", team: "LIV", position: "MID", price: 8.0 },
  { id: 22, name: "Phil Foden", team: "MCI", position: "MID", price: 9.0 },
  { id: 23, name: "Martin Odegaard", team: "ARS", position: "MID", price: 8.5 },
  { id: 24, name: "Marcus Rashford", team: "MUN", position: "MID", price: 8.5 },
  { id: 25, name: "James Maddison", team: "TOT", position: "MID", price: 8.0 },
  { id: 67, name: "Moorhouse", team: "ARS", position: "MID", price: 5.0 },
  { id: 68, name: "Ødegaard", team: "MUN", position: "MID", price: 8.5 },
  { id: 69, name: "Nkunku", team: "CRY", position: "MID", price: 7.5 },
  { id: 70, name: "Martinelli", team: "MUN", position: "MID", price: 6.5 },
  
  // Forwards
  { id: 26, name: "Erling Haaland", team: "MCI", position: "FWD", price: 14.0 },
  { id: 27, name: "Harry Kane", team: "BAY", position: "FWD", price: 11.0 },
  { id: 28, name: "Alexander Isak", team: "NEW", position: "FWD", price: 8.5 },
  { id: 29, name: "Darwin Nunez", team: "LIV", position: "FWD", price: 9.0 },
  { id: 30, name: "Ivan Toney", team: "BRE", position: "FWD", price: 7.5 },
  { id: 31, name: "Ollie Watkins", team: "AVL", position: "FWD", price: 9.0 },
  { id: 32, name: "Dominic Solanke", team: "BOU", position: "FWD", price: 7.5 },
  { id: 71, name: "Bamford", team: "EVE", position: "FWD", price: 6.5 },
  { id: 72, name: "Højlund", team: "ARS", position: "FWD", price: 8.0 },
  { id: 73, name: "Haaland", team: "WOL", position: "FWD", price: 14.0 },
];

interface TeamInputProps {
  onTeamSubmit: (team: any[]) => void;
}

export const TeamInput = ({ onTeamSubmit }: TeamInputProps) => {
  const [selectedTeam, setSelectedTeam] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [budget, setBudget] = useState(100.0);

  const filteredPlayers = mockPlayerDatabase.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlayerAdd = (player: any) => {
    if (selectedTeam.length >= 15) {
      return;
    }
    
    if (selectedTeam.find(p => p.id === player.id)) {
      return;
    }

    if (budget < player.price) {
      return;
    }

    setSelectedTeam([...selectedTeam, player]);
    setBudget(budget - player.price);
  };

  const handlePlayerRemove = (playerId: number) => {
    const player = selectedTeam.find(p => p.id === playerId);
    if (player) {
      setSelectedTeam(selectedTeam.filter(p => p.id !== playerId));
      setBudget(budget + player.price);
    }
  };

  const handlePlayersFromScreenshot = (playerNames: string[]) => {
    // Match extracted names with our database
    const matchedPlayers: any[] = [];
    
    playerNames.forEach(name => {
      const matched = mockPlayerDatabase.find(player => 
        player.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(player.name.toLowerCase())
      );
      
      if (matched && !selectedTeam.find(p => p.id === matched.id) && matchedPlayers.length < 15) {
        matchedPlayers.push(matched);
      }
    });

    // Calculate total cost
    const totalCost = matchedPlayers.reduce((sum, player) => sum + player.price, 0);
    
    if (totalCost <= 100) {
      setSelectedTeam(matchedPlayers);
      setBudget(100 - totalCost);
    } else {
      // If over budget, add as many as possible within budget
      let currentBudget = 100;
      const affordablePlayers: any[] = [];
      
      for (const player of matchedPlayers) {
        if (currentBudget >= player.price && affordablePlayers.length < 15) {
          affordablePlayers.push(player);
          currentBudget -= player.price;
        }
      }
      
      setSelectedTeam(affordablePlayers);
      setBudget(currentBudget);
    }
  };

  const handleSubmitTeam = () => {
    if (selectedTeam.length === 15) {
      onTeamSubmit(selectedTeam);
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GKP': return 'bg-yellow-500';
      case 'DEF': return 'bg-blue-500';
      case 'MID': return 'bg-green-500';
      case 'FWD': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="screenshot" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="screenshot" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Screenshot
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Manual
          </TabsTrigger>
          <TabsTrigger value="review" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="screenshot" className="space-y-4">
          <ImageUpload onPlayersExtracted={handlePlayersFromScreenshot} />
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Player Selection</CardTitle>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">
                  Budget: £{budget.toFixed(1)}M
                </Badge>
                <Badge variant="secondary">
                  Players: {selectedTeam.length}/15
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Players</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by player name or team..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {['GKP', 'DEF', 'MID', 'FWD'].map(position => {
                  const positionPlayers = filteredPlayers.filter(p => p.position === position);
                  if (positionPlayers.length === 0) return null;
                  
                  return (
                    <div key={position} className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${getPositionColor(position)}`}></span>
                        {position}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {positionPlayers.map(player => {
                          const isSelected = selectedTeam.find(p => p.id === player.id);
                          const canAfford = budget >= player.price;
                          const teamFull = selectedTeam.length >= 15;
                          
                          return (
                            <div key={player.id} className={`p-3 border rounded-md flex justify-between items-center ${isSelected ? 'bg-primary/10 border-primary' : ''}`}>
                              <div>
                                <div className="font-medium text-sm">{player.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {player.team} • £{player.price}M
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant={isSelected ? "secondary" : "outline"}
                                onClick={() => isSelected ? handlePlayerRemove(player.id) : handlePlayerAdd(player)}
                                disabled={!isSelected && (!canAfford || teamFull)}
                              >
                                {isSelected ? (
                                  "Remove"
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          <TeamConstraints 
            team={selectedTeam}
            budget={budget}
            onRemovePlayer={handlePlayerRemove}
          />
          
          {selectedTeam.length === 15 && (
            <Card>
              <CardContent className="pt-6">
                <Button 
                  onClick={handleSubmitTeam}
                  className="w-full"
                  size="lg"
                >
                  Submit My Team to Community Pool
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
