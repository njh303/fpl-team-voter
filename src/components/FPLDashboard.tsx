import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamInput } from "./team/TeamInput";
import { PopularPicks } from "./community/PopularPicks";
import { TeamConstraints } from "./team/TeamConstraints";

export const FPLDashboard = () => {
  const [currentGameweek] = useState(1);
  const [submittedTeams, setSubmittedTeams] = useState<any[][]>([]);
  const [hasSubmittedTeam, setHasSubmittedTeam] = useState(false);

  const handleTeamSubmit = (team: any[]) => {
    setSubmittedTeams([...submittedTeams, team]);
    setHasSubmittedTeam(true);
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
            Gameweek {currentGameweek} • Share your team and see popular picks
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Teams Submitted: {submittedTeams.length}
            </Badge>
            {hasSubmittedTeam && (
              <Badge variant="default" className="text-lg px-4 py-2">
                ✓ Your Team Submitted
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="vote" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="submit">Submit Your Team</TabsTrigger>
            <TabsTrigger value="popular">Popular Picks</TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Submit Your FPL Team</CardTitle>
                <CardDescription>
                  Upload screenshots or manually select your team to contribute to the community data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamInput onTeamSubmit={handleTeamSubmit} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <PopularPicks submittedTeams={submittedTeams} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};