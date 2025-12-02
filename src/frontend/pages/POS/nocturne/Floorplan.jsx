import React from 'react';
import { Card, CardContent } from './ui/card';
import { Layout } from 'lucide-react';
import './nocturne.css';

const Floorplan = () => {
  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Floor Plan Editor</h1>
        <p className="text-muted-foreground">Design your restaurant layout</p>
      </div>

      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="glass border-border max-w-2xl w-full">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Layout className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Drag-and-Drop Floorplan Editor
              </h2>
              <p className="text-lg text-muted-foreground max-w-md">
                Coming Soon
              </p>
              <p className="text-muted-foreground">
                Create custom layouts, position tables, and design your perfect restaurant floor plan with an intuitive drag-and-drop interface.
              </p>
              <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This feature is currently under development and will be available in a future update.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Floorplan;
