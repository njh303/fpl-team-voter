import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Star, Trophy } from "lucide-react";

interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  price: number;
  selections: number; // How many users picked this player
  selectionPercentage: number;
}

interface PopularPicksProps {
  submittedTeams: any[][]; // Array of team arrays from different users
}

// Mock data showing popular picks
const mockPopularPlayers: Player[] = [
  { id: 26, name: "Erling Haaland", team: "MCI", position: "FWD", price: 14.0, selections: 487, selectionPercentage: 89.2 },
  { id: 16, name: "Mohamed Salah", team: "LIV", position: "MID", price: 12.5, selections: 423, selectionPercentage: 77.5 },
  { id: 17, name: "Kevin De Bruyne", team: "MCI", position: "MID", price: 10.5, selections: 356, selectionPercentage: 65.2 },
  { id: 6, name: "Virgil van Dijk", team: "LIV", position: "DEF", price: 6.5, selections: 298, selectionPercentage: 54.6 },
  { id: 18, name: "Bukayo Saka", team: "ARS", position: "MID", price: 9.0, selections: 289, selectionPercentage: 52.9 },
  { id: 1, name: "Alisson", team: "LIV", position: "GKP", price: 5.5, selections: 267, selectionPercentage: 49.0 },
  { id: 28, name: "Alexander Isak", team: "NEW", position: "FWD", price: 8.5, selections: 234, selectionPercentage: 42.9 },
  { id: 11, name: "Andrew Robertson", team: "LIV", position: "DEF", price: 6.0, selections: 223, selectionPercentage: 40.8 },
  { id: 20, name: "Son Heung-min", team: "TOT", position: "MID", price: 9.5, selections: 198, selectionPercentage: 36.3 },
  { id: 31, name: "Ollie Watkins", team: "AVL", position: "FWD", price: 9.0, selections: 187, selectionPercentage: 34.3 },
];

export const PopularPicks = ({ submittedTeams }: PopularPicksProps) => {
  const totalSubmissions = 546; // Mock total number of team submissions

  // Get the most popular XI based on selections
  const getMostPopularXI = () => {
    const popularByPosition = {
      GKP: mockPopularPlayers.filter(p => p.position === 'GKP').slice(0, 1),
      DEF: mockPopularPlayers.filter(p => p.position === 'DEF').slice(0, 4),
      MID: mockPopularPlayers.filter(p => p.position === 'MID').slice(0, 4),
      FWD: mockPopularPlayers.filter(p => p.position === 'FWD').slice(0, 2),
    };
    
    return popularByPosition;
  };

  const mostPopularXI = getMostPopularXI();
  const totalCost = Object.values(mostPopularXI)
    .flat()
    .reduce((sum, player) => sum + player.price, 0);

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GKP': return 'bg-yellow-500';
      case 'DEF': return 'bg-blue-500';
      case 'MID': return 'bg-green-500';
      case 'FWD': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSelectionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-red-500';
    if (percentage >= 60) return 'text-orange-500';
    if (percentage >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
            <div className="text-xs text-muted-foreground">Teams submitted</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="w-4 h-4" />
              Most Popular
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{mockPopularPlayers[0]?.name.split(' ')[1] || 'Haaland'}</div>
            <div className="text-xs text-muted-foreground">{mockPopularPlayers[0]?.selectionPercentage}% ownership</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Template Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalCost.toFixed(1)}M</div>
            <div className="text-xs text-muted-foreground">Most popular XI</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Avg Ownership
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(mockPopularPlayers.slice(0, 11).reduce((sum, p) => sum + p.selectionPercentage, 0) / 11).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Starting XI</div>
          </CardContent>
        </Card>
      </div>

      {/* Most Popular XI Formation */}
      <Card>
        <CardHeader>
          <CardTitle>Community Template XI</CardTitle>
          <p className="text-sm text-muted-foreground">
            The most selected players across all submitted teams
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-b from-green-400 to-green-600 rounded-lg p-6 min-h-[400px]">
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_50px,white_50px,white_52px)]"></div>
            
            {/* Goalkeeper */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              {mostPopularXI.GKP.map(player => (
                <div key={player.id} className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs mb-1 relative">
                    {player.name.split(' ').map(n => n[0]).join('')}
                    <div className="absolute -top-1 -right-1 bg-white text-black text-xs px-1 rounded-full">
                      {player.selectionPercentage.toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-xs text-white font-medium">{player.name.split(' ')[1] || player.name}</div>
                </div>
              ))}
            </div>

            {/* Defenders */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-8">
              {mostPopularXI.DEF.map((player, index) => (
                <div key={player.id} className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs mb-1 relative">
                    {player.name.split(' ').map(n => n[0]).join('')}
                    <div className="absolute -top-1 -right-1 bg-white text-black text-xs px-1 rounded-full">
                      {player.selectionPercentage.toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-xs text-white font-medium">{player.name.split(' ')[1] || player.name}</div>
                </div>
              ))}
            </div>

            {/* Midfielders */}
            <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 flex space-x-8">
              {mostPopularXI.MID.map((player, index) => (
                <div key={player.id} className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs mb-1 relative">
                    {player.name.split(' ').map(n => n[0]).join('')}
                    <div className="absolute -top-1 -right-1 bg-white text-black text-xs px-1 rounded-full">
                      {player.selectionPercentage.toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-xs text-white font-medium">{player.name.split(' ')[1] || player.name}</div>
                </div>
              ))}
            </div>

            {/* Forwards */}
            <div className="absolute bottom-52 left-1/2 transform -translate-x-1/2 flex space-x-12">
              {mostPopularXI.FWD.map((player, index) => (
                <div key={player.id} className="text-center">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs mb-1 relative">
                    {player.name.split(' ').map(n => n[0]).join('')}
                    <div className="absolute -top-1 -right-1 bg-white text-black text-xs px-1 rounded-full">
                      {player.selectionPercentage.toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-xs text-white font-medium">{player.name.split(' ')[1] || player.name}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Popular Players List */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Players by Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {['GKP', 'DEF', 'MID', 'FWD'].map(position => {
              const positionPlayers = mockPopularPlayers.filter(p => p.position === position).slice(0, 5);
              
              return (
                <div key={position} className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${getPositionColor(position)}`}></span>
                    {position} - Top Picks
                  </h4>
                  <div className="space-y-2">
                    {positionPlayers.map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                          <div>
                            <div className="font-medium">{player.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {player.team} • £{player.price}M
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getSelectionColor(player.selectionPercentage)}`}>
                            {player.selectionPercentage}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {player.selections} picks
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selection Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Selection Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-500">
                  {mockPopularPlayers.filter(p => p.selectionPercentage >= 80).length}
                </div>
                <div className="text-xs text-muted-foreground">80%+ owned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">
                  {mockPopularPlayers.filter(p => p.selectionPercentage >= 60 && p.selectionPercentage < 80).length}
                </div>
                <div className="text-xs text-muted-foreground">60-79% owned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">
                  {mockPopularPlayers.filter(p => p.selectionPercentage >= 40 && p.selectionPercentage < 60).length}
                </div>
                <div className="text-xs text-muted-foreground">40-59% owned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {mockPopularPlayers.filter(p => p.selectionPercentage < 40).length}
                </div>
                <div className="text-xs text-muted-foreground">Under 40%</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Template Variance</div>
              <Progress value={85} className="h-2" />
              <div className="text-xs text-muted-foreground">
                85% of teams include at least 8 of the template players
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
