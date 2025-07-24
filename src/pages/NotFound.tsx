import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Search, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold text-destructive">404</CardTitle>
          <CardDescription className="text-lg">
            Page non trouvée
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className="space-y-3">
            <Button asChild className="w-full bg-gradient-primary hover:opacity-90">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link to="/auth/login">
                <Search className="w-4 h-4 mr-2" />
                Se connecter
              </Link>
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground mt-4">
            Route demandée: <code className="bg-muted px-1 py-0.5 rounded text-xs">
              {location.pathname}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
