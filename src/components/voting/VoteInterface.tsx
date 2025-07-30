import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Plus } from "lucide-react";

interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  price: number;
  votes: number;
}

interface VoteInterfaceProps {
  players: Player[];
  onVote: (playerId: number) => void;
  onPlayerSelect: (player: Player) => void;
}

export const VoteInterface = ({ players, onVote, onPlayerSelect }: VoteInterfaceProps) => {
  const [votedPlayers, setVotedPlayers] = useState<Set<number>>(new Set());

  const handleVote = (playerId: number) => {
    if (!votedPlayers.has(playerId)) {
      setVotedPlayers(new Set([...votedPlayers, playerId]));
      onVote(playerId);
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
    <div className="space-y-4">
      {['GKP', 'DEF', 'MID', 'FWD'].map(position => {
        const positionPlayers = players.filter(p => p.position === position);
        return (
          <div key={position} className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${getPositionColor(position)}`}></span>
              {position}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positionPlayers.map(player => (
                <Card key={player.id} className="hover:shadow-glow transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{player.name}</CardTitle>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{player.team}</Badge>
                      <span className="font-bold">£{player.price}M</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{player.votes}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={votedPlayers.has(player.id) ? "secondary" : "outline"}
                          onClick={() => handleVote(player.id)}
                          disabled={votedPlayers.has(player.id)}
                        >
                          {votedPlayers.has(player.id) ? "Voted" : "Vote"}
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onPlayerSelect(player)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};