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
    // Common FPL player name patterns and team abbreviations
    const teamAbbreviations = [
      'ARS', 'AVL', 'BOU', 'BRE', 'BHA', 'CHE', 'CRY', 'EVE', 'FUL', 'IPS',
      'LEI', 'LIV', 'MCI', 'MUN', 'NEW', 'NFO', 'SOU', 'TOT', 'WHU', 'WOL'
    ];
    
    // Split text into lines and words
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const players: string[] = [];
    
    for (const line of lines) {
      // Look for patterns that might be player names
      // Player names are usually followed by team abbreviation and price
      const words = line.split(/\s+/);
      
      // Check if line contains a team abbreviation
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
          const playerName = playerNameWords.join(' ').replace(/[^\w\s'-]/g, '').trim();
          
          if (playerName.length > 2 && playerName.split(' ').length <= 4) {
            players.push(playerName);
          }
        }
      }
    }
    
    return [...new Set(players)]; // Remove duplicates
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