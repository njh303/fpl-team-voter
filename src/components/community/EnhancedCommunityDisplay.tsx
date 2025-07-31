import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Crown, Shield } from "lucide-react";

interface TeamSubmission {
  players: any[];
  captain: number;
  viceCaptain?: number;
}

interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  price: number;
  selections: number;
  selectionPercentage: number;
  captainCount?: number;
  viceCaptainCount?: number;
}

interface EnhancedCommunityDisplayProps {
  submittedTeams: TeamSubmission[];
}

export const EnhancedCommunityDisplay = ({ submittedTeams }: EnhancedCommunityDisplayProps) => {
  // Process submitted teams to get popular picks
  const processTeamData = () => {
    const playerCounts: { [key: number]: { count: number; captainCount: number; viceCaptainCount: number; player: any } } = {};
    
    submittedTeams.forEach(submission => {
      submission.players.forEach(player => {
        if (!playerCounts[player.id]) {
          playerCounts[player.id] = { count: 0, captainCount: 0, viceCaptainCount: 0, player };
        }
        playerCounts[player.id].count++;
        
        if (submission.captain === player.id) {
          playerCounts[player.id].captainCount++;
        }
        if (submission.viceCaptain === player.id) {
          playerCounts[player.id].viceCaptainCount++;
        }
      });
    });

    return Object.values(playerCounts).map(({ count, captainCount, viceCaptainCount, player }) => ({
      ...player,
      selections: count,
      selectionPercentage: submittedTeams.length > 0 ? (count / submittedTeams.length) * 100 : 0,
      captainCount,
      viceCaptainCount
    }));
  };

  const popularPlayers = processTeamData();
  const mostPopularCaptain = popularPlayers.reduce((prev, current) => 
    (prev.captainCount > current.captainCount) ? prev : current, popularPlayers[0]
  );

  const getMostPopularXI = () => {
    const gkp = popularPlayers.filter(p => p.position === 'GKP').sort((a, b) => b.selections - a.selections)[0];
    const def = popularPlayers.filter(p => p.position === 'DEF').sort((a, b) => b.selections - a.selections).slice(0, 4);
    const mid = popularPlayers.filter(p => p.position === 'MID').sort((a, b) => b.selections - a.selections).slice(0, 4);
    const fwd = popularPlayers.filter(p => p.position === 'FWD').sort((a, b) => b.selections - a.selections).slice(0, 2);
    
    return { gkp, def, mid, fwd };
  };

  const mostPopularXI = getMostPopularXI();
  const benchPlayers = popularPlayers.filter(p => 
    ![mostPopularXI.gkp, ...mostPopularXI.def, ...mostPopularXI.mid, ...mostPopularXI.fwd].includes(p)
  ).sort((a, b) => b.selections - a.selections).slice(0, 4);

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'GKP': return 'bg-yellow-500 text-yellow-900';
      case 'DEF': return 'bg-blue-500 text-blue-900';
      case 'MID': return 'bg-green-500 text-green-900';
      case 'FWD': return 'bg-red-500 text-red-900';
      default: return 'bg-gray-500 text-gray-900';
    }
  };

  const PlayerCard = ({ player, isCaptain = false }: { player: Player; isCaptain?: boolean }) => (
    <div className="relative">
      <div className={`
        p-3 rounded-lg border-2 border-white/20 backdrop-blur-sm
        ${getPositionColor(player.position)} shadow-lg
        flex flex-col items-center text-center space-y-1 min-h-[100px]
      `}>
        {isCaptain && (
          <Crown className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 fill-yellow-400" />
        )}
        <div className="font-bold text-lg">
          {player.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="text-xs font-semibold">{player.name}</div>
        <div className="text-xs">{player.team}</div>
        <Badge variant="secondary" className="text-xs">
          {player.selectionPercentage.toFixed(0)}%
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{submittedTeams.length}</div>
            <div className="text-sm text-muted-foreground">Total Submissions</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {mostPopularCaptain ? mostPopularCaptain.captainCount : 0}
            </div>
            <div className="text-sm text-muted-foreground">Top Captain Picks</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              £{mostPopularXI.gkp && [...[mostPopularXI.gkp], ...mostPopularXI.def, ...mostPopularXI.mid, ...mostPopularXI.fwd]
                .reduce((sum, p) => sum + p.price, 0).toFixed(1)}M
            </div>
            <div className="text-sm text-muted-foreground">Template Cost</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {popularPlayers.length > 0 ? 
                (popularPlayers.reduce((sum, p) => sum + p.selectionPercentage, 0) / popularPlayers.length).toFixed(0) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Ownership</div>
          </CardContent>
        </Card>
      </div>

      {/* Community Template XI */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Community Template XI (4-4-2)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-b from-green-600 to-green-700 rounded-lg p-6 min-h-[400px]">
            {/* Formation Layout */}
            <div className="grid grid-rows-4 gap-4 h-full">
              {/* Forwards */}
              <div className="flex justify-center items-center gap-8">
                {mostPopularXI.fwd.map((player, idx) => (
                  <PlayerCard 
                    key={player.id} 
                    player={player} 
                    isCaptain={mostPopularCaptain?.id === player.id}
                  />
                ))}
              </div>
              
              {/* Midfielders */}
              <div className="flex justify-center items-center gap-4">
                {mostPopularXI.mid.map((player, idx) => (
                  <PlayerCard 
                    key={player.id} 
                    player={player} 
                    isCaptain={mostPopularCaptain?.id === player.id}
                  />
                ))}
              </div>
              
              {/* Defenders */}
              <div className="flex justify-center items-center gap-3">
                {mostPopularXI.def.map((player, idx) => (
                  <PlayerCard 
                    key={player.id} 
                    player={player} 
                    isCaptain={mostPopularCaptain?.id === player.id}
                  />
                ))}
              </div>
              
              {/* Goalkeeper */}
              <div className="flex justify-center items-center">
                {mostPopularXI.gkp && (
                  <PlayerCard 
                    player={mostPopularXI.gkp} 
                    isCaptain={mostPopularCaptain?.id === mostPopularXI.gkp.id}
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Most Popular Bench */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Most Popular Bench</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 justify-center">
            {benchPlayers.map((player, idx) => (
              <div key={player.id} className="text-center">
                <div className={`
                  p-2 rounded-lg ${getPositionColor(player.position)} 
                  mb-2 min-w-[80px]
                `}>
                  <div className="font-bold text-sm">
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-xs">{player.team}</div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {player.selectionPercentage.toFixed(0)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Captain Statistics */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Most Popular Captains
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {popularPlayers
              .filter(p => p.captainCount > 0)
              .sort((a, b) => b.captainCount - a.captainCount)
              .slice(0, 5)
              .map((player, idx) => {
                const captainPercentage = submittedTeams.length > 0 ? 
                  (player.captainCount / submittedTeams.length) * 100 : 0;
                
                return (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {idx + 1}
                      </Badge>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {player.team} • {player.position} • £{player.price}M
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{captainPercentage.toFixed(0)}%</div>
                      <div className="text-sm text-muted-foreground">
                        {player.captainCount} picks
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Selection Distribution */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Selection Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>80%+ Ownership</span>
                <span>{popularPlayers.filter(p => p.selectionPercentage >= 80).length} players</span>
              </div>
              <Progress value={popularPlayers.filter(p => p.selectionPercentage >= 80).length / popularPlayers.length * 100} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>50-79% Ownership</span>
                <span>{popularPlayers.filter(p => p.selectionPercentage >= 50 && p.selectionPercentage < 80).length} players</span>
              </div>
              <Progress value={popularPlayers.filter(p => p.selectionPercentage >= 50 && p.selectionPercentage < 80).length / popularPlayers.length * 100} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>20-49% Ownership</span>
                <span>{popularPlayers.filter(p => p.selectionPercentage >= 20 && p.selectionPercentage < 50).length} players</span>
              </div>
              <Progress value={popularPlayers.filter(p => p.selectionPercentage >= 20 && p.selectionPercentage < 50).length / popularPlayers.length * 100} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
