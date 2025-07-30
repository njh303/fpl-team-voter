import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star } from "lucide-react";

interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  price: number;
  votes: number;
}

interface CommunityTeamProps {
  players: Player[];
}

export const CommunityTeam = ({ players }: CommunityTeamProps) => {
  // Get top voted players by position for the community team
  const getTopPlayersByPosition = (position: string, count: number) => {
    return players
      .filter(p => p.position === position)
      .sort((a, b) => b.votes - a.votes)
      .slice(0, count);
  };

  const formation = {
    GKP: getTopPlayersByPosition('GKP', 1),
    DEF: getTopPlayersByPosition('DEF', 4),
    MID: getTopPlayersByPosition('MID', 4),
    FWD: getTopPlayersByPosition('FWD', 2),
  };

  const totalPrice = Object.values(formation)
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

  return (
    <div className="space-y-6">
      {/* Formation Display */}
      <div className="relative bg-gradient-to-b from-green-400 to-green-600 rounded-lg p-6 min-h-[400px]">
        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_50px,white_50px,white_52px)]"></div>
        
        {/* Goalkeeper */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          {formation.GKP.map(player => (
            <div key={player.id} className="text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs mb-1">
                {player.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-xs text-white font-medium">{player.name.split(' ')[1] || player.name}</div>
            </div>
          ))}
        </div>

        {/* Defenders */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-8">
          {formation.DEF.map((player, index) => (
            <div key={player.id} className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs mb-1">
                {player.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-xs text-white font-medium">{player.name.split(' ')[1] || player.name}</div>
            </div>
          ))}
        </div>

        {/* Midfielders */}
        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 flex space-x-8">
          {formation.MID.map((player, index) => (
            <div key={player.id} className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs mb-1">
                {player.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-xs text-white font-medium">{player.name.split(' ')[1] || player.name}</div>
            </div>
          ))}
        </div>

        {/* Forwards */}
        <div className="absolute bottom-52 left-1/2 transform -translate-x-1/2 flex space-x-12">
          {formation.FWD.map((player, index) => (
            <div key={player.id} className="text-center">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs mb-1">
                {player.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-xs text-white font-medium">{player.name.split(' ')[1] || player.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalPrice.toFixed(1)}M</div>
            <div className="text-sm text-muted-foreground">
              Budget remaining: £{(100 - totalPrice).toFixed(1)}M
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="w-4 h-4" />
              Total Votes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(formation).flat().reduce((sum, player) => sum + player.votes, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Community support</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Formation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4-4-2</div>
            <div className="text-sm text-muted-foreground">Balanced setup</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Player List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Community XI Details</h3>
        <div className="space-y-2">
          {Object.entries(formation).map(([position, positionPlayers]) => (
            <div key={position} className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${getPositionColor(position)}`}></span>
                {position}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {positionPlayers.map(player => (
                  <Card key={player.id} className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">{player.team}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">£{player.price}M</div>
                        <div className="text-sm text-muted-foreground">{player.votes} votes</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
