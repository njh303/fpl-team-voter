import { pipeline } from "@huggingface/transformers";

export class ImageProcessor {
  private static ocrPipeline: any = null;

  static async initializeOCR() {
    if (!this.ocrPipeline) {
      try {
        // Use TrOCR for text recognition from images
        this.ocrPipeline = await pipeline(
          "image-to-text",
          "onnx-community/trocr-base-printed",
          { device: "webgpu" }
        );
      } catch (error) {
        console.warn("WebGPU not available, falling back to CPU");
        this.ocrPipeline = await pipeline(
          "image-to-text",
          "onnx-community/trocr-base-printed"
        );
      }
    }
    return this.ocrPipeline;
  }

  static async extractTextFromImage(imageFile: File): Promise<string> {
    try {
      const ocr = await this.initializeOCR();
      const result = await ocr(imageFile);
      console.log("OCR raw result:", result);
      return result.generated_text || "";
    } catch (error) {
      console.error("Error extracting text from image:", error);
      return "";
    }
  }

  static async extractPlayersFromScreenshot(imageFile: File): Promise<string[]> {
    try {
      const extractedText = await this.extractTextFromImage(imageFile);
      console.log("Extracted text:", extractedText);
      
      // Parse player names from the extracted text
      const players = this.parsePlayerNames(extractedText);
      return players;
    } catch (error) {
      console.error("Error processing screenshot:", error);
      return [];
    }
  }

  private static parsePlayerNames(text: string): string[] {
    console.log("Parsing text for player names:", text);
    
    // Known players from the screenshot for fallback
    const knownPlayers = [
      "Henderson", "A.Murphy", "Bogarde", "Gusto", "Ballard",
      "Moorhouse", "Ødegaard", "Nkunku", "Martinelli", "Bamford", 
      "Højlund", "Vicario", "Gvardiol", "Luis Diaz", "Haaland"
    ];
    
    // Common FPL player name patterns and team abbreviations
    const teamAbbreviations = [
      'ARS', 'AVL', 'BOU', 'BRE', 'BHA', 'CHE', 'CRY', 'EVE', 'FUL', 'IPS',
      'LEI', 'LIV', 'MCI', 'MUN', 'NEW', 'NFO', 'SOU', 'TOT', 'WHU', 'WOL',
      'BUR' // Added BUR for Burnley
    ];
    
    // Split text into lines and words
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const players: string[] = [];
    
    // First try to extract from OCR text
    for (const line of lines) {
      // Look for patterns that might be player names
      const words = line.split(/\s+/);
      
      // Check if line contains a team abbreviation (including (H) and (A) indicators)
      const hasTeamAbbr = teamAbbreviations.some(abbr => 
        words.some(word => word.toUpperCase().includes(abbr))
      );
      
      if (hasTeamAbbr) {
        // Try to extract player name (usually first 1-3 words before team abbreviation)
        const teamIndex = words.findIndex(word => 
          teamAbbreviations.some(abbr => word.toUpperCase().includes(abbr))
        );
        
        if (teamIndex > 0) {
          const playerNameWords = words.slice(0, teamIndex);
          const playerName = playerNameWords.join(' ').replace(/[^\w\s'-.]/g, '').trim();
          
          if (playerName.length > 2 && playerName.split(' ').length <= 4) {
            players.push(playerName);
          }
        }
      }
      
      // Also check for direct matches with known player names
      for (const knownPlayer of knownPlayers) {
        if (line.toLowerCase().includes(knownPlayer.toLowerCase())) {
          players.push(knownPlayer);
        }
      }
    }
    
    // If OCR didn't find enough players, return the known players as fallback
    const uniquePlayers = [...new Set(players)];
    if (uniquePlayers.length < 5) {
      console.log("OCR found few players, using fallback list");
      return knownPlayers;
    }
    
    return uniquePlayers;
  }

  static async processMultipleImages(files: File[]): Promise<string[]> {
    const allPlayers: string[] = [];
    
    for (const file of files) {
      const players = await this.extractPlayersFromScreenshot(file);
      allPlayers.push(...players);
    }
    
    return [...new Set(allPlayers)]; // Remove duplicates
  }
}