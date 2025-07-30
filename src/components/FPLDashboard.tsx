import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoteInterface } from "./voting/VoteInterface";
import { CommunityTeam } from "./community/CommunityTeam";
import { TeamConstraints } from "./team/TeamConstraints";

// Mock data for demonstration
const mockPlayers = [
  { id: 1, name: "Erling Haaland", team: "MCI", position: "FWD", price: 14.0, votes: 150 },
  { id: 2, name: "Mohamed Salah", team: "LIV", position: "MID", price: 12.5, votes: 145 },
  { id: 3, name: "Harry Kane", team: "BAY", position: "FWD", price: 11.0, votes: 120 },
  { id: 4, name: "Kevin De Bruyne", team: "MCI", position: "MID", price: 10.5, votes: 110 },
  { id: 5, name: "Virgil van Dijk", team: "LIV", position: "DEF", price: 6.5, votes: 95 },
];

export const FPLDashboard = () => {
  const [currentGameweek] = useState(1);
  const [userTeam, setUserTeam] = useState<any[]>([]);
  const [budget, setBudget] = useState(100.0);

  const handleVote = (playerId: number) => {
    console.log(`Voted for player ${playerId}`);
    // In real implementation, this would call Supabase
  };

  const handlePlayerSelect = (player: any) => {
    if (userTeam.length < 15) {
      setUserTeam([...userTeam, player]);
      setBudget(budget - player.price);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            FPL Community Picks
          </h1>
          <p className="text-xl text-white/80">
            Gameweek {currentGameweek} • Vote for the best picks
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Budget: £{budget.toFixed(1)}M
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Players: {userTeam.length}/15
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="vote" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="vote">Vote on Players</TabsTrigger>
            <TabsTrigger value="community">Community Team</TabsTrigger>
            <TabsTrigger value="my-team">My Team</TabsTrigger>
          </TabsList>

          <TabsContent value="vote" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Vote for Your Top Picks</CardTitle>
                <CardDescription>
                  Vote for players you think should be in the community team this gameweek
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VoteInterface 
                  players={mockPlayers} 
                  onVote={handleVote}
                  onPlayerSelect={handlePlayerSelect}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Community Consensus Team</CardTitle>
                <CardDescription>
                  The most voted XI based on community input
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommunityTeam players={mockPlayers} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-team" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Your Team</CardTitle>
                <CardDescription>
                  Build your team within FPL constraints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamConstraints 
                  team={userTeam} 
                  budget={budget}
                  onRemovePlayer={(playerId) => {
                    const player = userTeam.find(p => p.id === playerId);
                    if (player) {
                      setUserTeam(userTeam.filter(p => p.id !== playerId));
                      setBudget(budget + player.price);
                    }
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};