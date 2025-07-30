import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Camera, FileImage, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ImageProcessor } from "@/utils/ImageProcessor";

interface ImageUploadProps {
  onPlayersExtracted: (players: string[]) => void;
}

export const ImageUpload = ({ onPlayersExtracted }: ImageUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string>("");
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast({
        title: "Invalid Files",
        description: "Please upload image files only",
        variant: "destructive",
      });
      return;
    }

    setUploadedFiles(prev => [...prev, ...imageFiles]);
  }, [toast]);

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processImages = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Images",
        description: "Please upload at least one screenshot",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const extractedPlayers = await ImageProcessor.processMultipleImages(uploadedFiles);
      
      clearInterval(interval);
      setProgress(100);

      if (extractedPlayers.length > 0) {
        onPlayersExtracted(extractedPlayers);
        toast({
          title: "Success!",
          description: `Found ${extractedPlayers.length} players in your screenshots`,
        });
      } else {
        toast({
          title: "No Players Found",
          description: "Unable to extract player names from the screenshots. Try uploading clearer images.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error processing images:", error);
      toast({
        title: "Processing Error",
        description: "Failed to process images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Upload FPL Screenshots
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload screenshots from your FPL app and we'll extract your team automatically
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium text-primary">Click to upload</span>
              <span className="text-muted-foreground"> or drag and drop</span>
            </div>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, JPEG up to 10MB each
            </p>
          </label>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Uploaded Screenshots ({uploadedFiles.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  <div className="absolute bottom-1 left-1 right-1">
                    <Badge variant="secondary" className="text-xs truncate">
                      {file.name}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Processing screenshots...</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Process Button */}
        <Button
          onClick={processImages}
          disabled={uploadedFiles.length === 0 || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileImage className="w-4 h-4 mr-2" />
              Extract Players from Screenshots
            </>
          )}
        </Button>

        {/* Tips */}
        <div className="bg-muted/50 rounded-md p-3">
          <h5 className="text-sm font-medium mb-2">Tips for better recognition:</h5>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Take clear screenshots of your team selection</li>
            <li>• Include both the starting XI and bench players</li>
            <li>• Make sure player names are clearly visible</li>
            <li>• Multiple screenshots can capture different sections</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};