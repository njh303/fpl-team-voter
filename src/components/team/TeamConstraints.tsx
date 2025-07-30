import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trash2, AlertTriangle, CheckCircle } from "lucide-react";

interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  price: number;
}

interface TeamConstraintsProps {
  team: Player[];
  budget: number;
  onRemovePlayer: (playerId: number) => void;
}

export const TeamConstraints = ({ team, budget, onRemovePlayer }: TeamConstraintsProps) => {
  // Count players by position
  const positionCounts = team.reduce((acc, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Count players by club
  const clubCounts = team.reduce((acc, player) => {
    acc[player.team] = (acc[player.team] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Check constraints
  const constraints = [
    {
      name: "Total Players",
      current: team.length,
      required: 15,
      max: 15,
      status: team.length === 15 ? "complete" : team.length < 15 ? "incomplete" : "invalid"
    },
    {
      name: "Goalkeepers",
      current: positionCounts.GKP || 0,
      required: 2,
      max: 2,
      status: (positionCounts.GKP || 0) === 2 ? "complete" : "incomplete"
    },
    {
      name: "Defenders",
      current: positionCounts.DEF || 0,
      required: 5,
      max: 5,
      status: (positionCounts.DEF || 0) === 5 ? "complete" : "incomplete"
    },
    {
      name: "Midfielders",
      current: positionCounts.MID || 0,
      required: 5,
      max: 5,
      status: (positionCounts.MID || 0) === 5 ? "complete" : "incomplete"
    },
    {
      name: "Forwards",
      current: positionCounts.FWD || 0,
      required: 3,
      max: 3,
      status: (positionCounts.FWD || 0) === 3 ? "complete" : "incomplete"
    },
    {
      name: "Budget",
      current: 100 - budget,
      required: 100,
      max: 100,
      status: budget >= 0 ? (budget === 0 ? "complete" : "incomplete") : "invalid"
    }
  ];

  // Check club constraints (max 3 per club)
  const clubViolations = Object.entries(clubCounts).filter(([club, count]) => count > 3);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "invalid":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
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
      {/* Constraints Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Team Constraints
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {constraints.map((constraint, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {getStatusIcon(constraint.status)}
                  <span className="font-medium">{constraint.name}</span>
                </div>
                <span className="text-sm">
                  {constraint.name === "Budget" 
                    ? `£${constraint.current.toFixed(1)}M / £${constraint.required}M`
                    : `${constraint.current} / ${constraint.required}`
                  }
                </span>
              </div>
              <Progress 
                value={(constraint.current / constraint.required) * 100} 
                className="h-2"
              />
            </div>
          ))}

          {/* Club Constraint Violations */}
          {clubViolations.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
                <AlertTriangle className="w-4 h-4" />
                Club Limit Exceeded
              </div>
              <div className="text-sm text-red-600">
                {clubViolations.map(([club, count]) => (
                  <div key={club}>
                    {club}: {count} players (max 3 allowed)
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Team */}
      <Card>
        <CardHeader>
          <CardTitle>Your Current Team ({team.length}/15)</CardTitle>
        </CardHeader>
        <CardContent>
          {team.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No players selected yet. Start building your team!
            </div>
          ) : (
            <div className="space-y-4">
              {['GKP', 'DEF', 'MID', 'FWD'].map(position => {
                const positionPlayers = team.filter(p => p.position === position);
                if (positionPlayers.length === 0) return null;
                
                return (
                  <div key={position} className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${getPositionColor(position)}`}></span>
                      {position} ({positionPlayers.length})
                    </h4>
                    <div className="space-y-2">
                      {positionPlayers.map(player => (
                        <div key={player.id} className="flex justify-between items-center p-3 bg-muted rounded-md">
                          <div>
                            <div className="font-medium">{player.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {player.team} • £{player.price}M
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onRemovePlayer(player.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Budget:</span>
              <span className="font-medium">£100.0M</span>
            </div>
            <div className="flex justify-between">
              <span>Spent:</span>
              <span className="font-medium">£{(100 - budget).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Remaining:</span>
              <span className={`font-bold ${budget < 0 ? 'text-red-500' : 'text-green-500'}`}>
                £{budget.toFixed(1)}M
              </span>
            </div>
          </div>
          <Progress 
            value={((100 - budget) / 100) * 100} 
            className="h-3 mt-4"
          />
        </CardContent>
      </Card>
    </div>
  );
};