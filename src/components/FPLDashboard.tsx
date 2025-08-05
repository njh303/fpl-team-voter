import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamInput } from "./team/TeamInput";
import { EnhancedCommunityDisplay } from "./community/EnhancedCommunityDisplay";
import { TeamConstraints } from "./team/TeamConstraints";
import { toast } from "sonner";

// Current gameweek (in a real app this would come from an API)
const CURRENT_GAMEWEEK = 15;

interface TeamSubmission {
  players: any[];
  captain: number;
  viceCaptain?: number;
}

export const FPLDashboard = () => {
  const [submittedTeams, setSubmittedTeams] = useState<TeamSubmission[]>([]);
  const [hasSubmittedThisGameweek, setHasSubmittedThisGameweek] = useState(false);

  // Check if user has already submitted for this gameweek
  useEffect(() => {
    const submissionKey = `gw_${CURRENT_GAMEWEEK}_submitted`;
    const hasSubmitted = localStorage.getItem(submissionKey) === 'true';
    setHasSubmittedThisGameweek(hasSubmitted);
  }, []);

  const handleTeamSubmit = (team: TeamSubmission) => {
    if (hasSubmittedThisGameweek) {
      toast.error("You have already submitted a team for this gameweek!");
      return;
    }

    setSubmittedTeams([...submittedTeams, team]);
    
    // Mark as submitted for this gameweek
    const submissionKey = `gw_${CURRENT_GAMEWEEK}_submitted`;
    localStorage.setItem(submissionKey, 'true');
    setHasSubmittedThisGameweek(true);
    
    toast.success("Team submitted successfully!");
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
            Gameweek {CURRENT_GAMEWEEK} • Share your team and see popular picks
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Teams Submitted: {submittedTeams.length}
            </Badge>
            {hasSubmittedThisGameweek && (
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
                  {hasSubmittedThisGameweek 
                    ? `You've already submitted your team for Gameweek ${CURRENT_GAMEWEEK}`
                    : "Upload screenshots or manually select your team to contribute to the community data"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasSubmittedThisGameweek ? (
                  <div className="text-center py-8">
                    <p className="text-lg font-medium mb-2">Team submission complete!</p>
                    <p className="text-muted-foreground">Check out the community selections in the Popular Picks tab or wait for the next gameweek.</p>
                  </div>
                ) : (
                  <TeamInput onTeamSubmit={handleTeamSubmit} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <EnhancedCommunityDisplay submittedTeams={submittedTeams} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};